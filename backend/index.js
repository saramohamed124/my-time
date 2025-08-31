const express = require('express');
const mongoose = require('mongoose');
const firebaseAdmin = require('firebase-admin');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Users = require('./models/Users');
const app = express();
const Todo = require('./models/Todo');

const corsOptions = {
  origin: ['http://localhost:3000', 'https://my-time-hazel.vercel.app'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
require("dotenv").config();

const path = require('path');
const EngineeringDiscipline = require('./models/EngineeringDiscipline');
const ComputerScienceField = require('./models/ComputerScienceField');
const BusinessDiscipline = require('./models/BusinessDiscipline');




mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB!');
})
.catch((err) => {
    console.log('Not connected to MongoDB.', err);
});

const firebaseAdminKey = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_KEY, 'base64').toString('utf8')
);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseAdminKey),
});

// Handle Google Sign-In Token Verification
// /auth/google
app.post('/auth/google', async (req, res) => {
    const { idToken } = req.body;
  
    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required.' });
    }
  
    try {
      // ✅ Use Admin SDK to verify the token
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
  
      const { uid, email, name, picture } = decodedToken;
      const firstName = decodedToken.given_name || name?.split(' ')[0] || 'User';
      const lastName = decodedToken.family_name || name?.split(' ').slice(1).join(' ') || '';
  
      let user = await Users.findOne({ email });
  
      if (!user) {
        user = new Users({
          firstName,
          lastName,
          email,
          password: null,
          role: 'Student',
          specialty_id: null,
        });
        await user.save();
        
        return res.status(201).json({ message: 'User created successfully', user });
      }
  
      return res.status(200).json({ message: 'User already exists', user });
  
    } catch (error) {
      return res.status(500).json({ message: 'Failed to verify token' });
    }
});

// New Signup Route
app.post('/auth/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new Users({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'Student',
        specialty_id: null,
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User signed up successfully!', user: newUser });
    } catch (err) {
      console.log(err);
      
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login 
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ message: 'البريد الإلكتروني وكلمة المرور مطلوبة.' });
  }

  try {
    // Find user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود.' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid ) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }

    // Success: return basic user info (without sensitive data)
    res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح!',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'حدث خطأ في الخادم.' });
  }
});

// Users

app.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Check if the userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const user = await Users.findById(userId).select('-password -__v');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// EDIT a user's profile (first name, last name, email, etc.)
// Example usage: PUT /api/users/12345
app.put('/user/:userId', async (req, res) => {
    const { firstName, lastName, specialty_id, email, role } = req.body;
    try {
        const user = await Users.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if they are provided
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (specialty_id) user.specialty_id = specialty_id;
        if (email) user.email = email;
        if (role) user.role = role;

        // Run Mongoose validation on the updated user object
        await user.validate();

        const updatedUser = await user.save();
        res.status(200).json({
            message: 'User profile updated successfully',
            user: updatedUser.toObject({ getters: true, virtuals: false, transform: (doc, ret) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            }})
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation error', errors: messages });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// CHANGE a user's password
// Example usage: PUT /api/users/12345/password
app.put('/user/:userId/password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old password and new password are required' });
    }
    try {
        const user = await Users.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(!user.password){
            return res.status(400).json({ message: ' لا يمكنك تغيير كلمة المرور لأن حسابك مرتبط بتسجيل الدخول عبر جوجل.' });
        }
        // Validate the old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid old password' });
        }

        // Check if the new password meets the schema validation
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(hashedPassword);
        const newUser = new Users({ ...user, password: hashedPassword });
        await newUser.validate(['password']);

        // Set the new password, the 'save' hook will hash it
        user.password = hashedPassword;
        await user.save();
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      console.log(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation error', errors: messages });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// CREATE a new task with level


// GET all tasks
// CREATE a new task with userId (user-specific)
app.post('/todos', async (req, res) => {
  const { title, description, type, level, userId } = req.body;

  if (!title || !description || !type || !level || !userId) {
    return res.status(400).json({ message: 'الرجاء ملء جميع الحقول المطلوبة' });
  }

  try {
    const todo = new Todo({
      title,
      description,
      type,
      level,
      userId,  // Associate the task with the user
    });
    await todo.save();
    res.status(201).json({ message: 'تم إنشاء المهمة بنجاح', todo });
  } catch (err) {
    res.status(500).json({ message: 'خطأ أثناء إنشاء المهمة', error: err.message });
  }
});
// GET tasks by user ID
app.get('/todos/user/:userId', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.params.userId }); // Filter by userId
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: 'خطأ أثناء جلب المهام', error: err.message });
  }
});

// GET task by ID
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'المهمة غير موجودة' });
    }
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'خطأ أثناء جلب المهمة', error: err.message });
  }
});

// UPDATE a task with level
app.put('/todos/:id', async (req, res) => {
  const { title, description, type, level, completed } = req.body;

  if (!title || !description || !type || !level) {
    return res.status(400).json({ message: 'الرجاء ملء جميع الحقول المطلوبة' });
  }

  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, type, level, completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'المهمة غير موجودة' });
    }
    res.status(200).json({ message: 'تم تحديث المهمة بنجاح', todo });
  } catch (err) {
    res.status(500).json({ message: 'خطأ أثناء تحديث المهمة', error: err.message });
  }
});

// DELETE a task
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'المهمة غير موجودة' });
    }
    res.status(200).json({ message: 'تم حذف المهمة بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ أثناء حذف المهمة', error: err.message });
  }
});

// Jobs & Specialties
app.get('/engineering-specialties', async (req, res) => {
  try {
    const specialties = await EngineeringDiscipline.find();
    res.status(200).json(specialties);
  }catch (err) {
    res.status(500).json({ message: 'خطأ أثناء جلب التخصصات', error: err.message });
  }
});

app.get('/cs-specialties', async (req, res) => {
  try {
    const specialties = await ComputerScienceField.find();
    res.status(200).json(specialties);
  }catch (err) {
    res.status(500).json({ message: 'خطأ أثناء جلب التخصصات', error: err.message });
  }
});

app.get('/business-specialties', async (req, res) => {
  try {
    const specialties = await BusinessDiscipline.find();
    res.status(200).json(specialties);
  }catch (err) {
    res.status(500).json({ message: 'خطأ أثناء جلب التخصصات', error: err.message });
  }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server running on port 3050");
});