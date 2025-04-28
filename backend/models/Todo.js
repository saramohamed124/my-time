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
    enum: ['exam', 'interview', 'task'], // Restrict values to these options
    required: true // Make sure this field is provided
  },
  // New 'level' field
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'], // Restrict values to these options
    required: true // Make sure this field is provided
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
