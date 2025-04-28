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


// CREATE a new task with level
// CREATE a new task with level
app.post('/todos', async (req, res) => {
  const { title, description, type, level } = req.body;

  if (!title || !description || !type || !level) {
    return res.status(400).json({ message: 'الرجاء ملء جميع الحقول المطلوبة' });
  }

  try {
    const todo = new Todo({ title, description, type, level });
    await todo.save();
    res.status(201).json({ message: 'تم إنشاء المهمة بنجاح', todo });
  } catch (err) {
    res.status(500).json({ message: 'خطأ أثناء إنشاء المهمة', error: err.message });
  }
});

// GET all tasks
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
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



// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server running on port 3050");
});