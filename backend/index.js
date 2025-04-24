const express = require('express');
const mongoose = require('mongoose');
const firebaseAdmin = require('firebase-admin');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Users = require('./models/Users');
const app = express();

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
        hashedPassword,
        role: 'Student',
        specialty_id: null,
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User signed up successfully!', user: newUser });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server running on port 3050");
});