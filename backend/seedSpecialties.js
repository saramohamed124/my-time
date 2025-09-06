const mongoose = require('mongoose');
const express = require('express');
const Specialties = require('./models/Specialties');
const app = express();

// Replace with your MongoDB connection string
const corsOptions = {
  origin: ['http://localhost:3000', 'https://my-time-hazel.vercel.app'],
  credentials: true
};

app.use(express.json());
require("dotenv").config();



mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB!');
})
.catch((err) => {
    console.log('Not connected to MongoDB.', err);
});

  const specialties = [
    { name: "هندسة الميكاترونكس" },
    { name: "هندسة الميكانيكا"},
    { name: "هندسة طبية" },
    {  name: "الهندسة المعمارية" },
    { name: "هندسة مدنية" },
    { name: "هندسة كيميائية" },
    { name: "هندسة كهربائية" },
    { name: "علوم الحاسب" },
    { name: "التسويق" },
    { name: "الموارد البشرية" },
    { name: "نظم المعلومات الإدارية"},
    { name: "المحاسبة"},
  ];

// Insert departments into MongoDB
const seedDB = async() => {
  await Specialties.deleteMany({}); // Clear old Data
  await Specialties.insertMany(specialties);
  console.log("Specialties Added Successfully!");
  mongoose.connection.close();
}
seedDB();