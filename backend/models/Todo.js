// models/Todo.js

const mongoose = require('mongoose');

// Defining the Todo schema
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // New 'type' field
  type: {
    type: String,
    enum: ['exam', 'interview', 'task'],
    required: true 
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
