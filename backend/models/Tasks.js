const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    due_date:{
        type: Date,
        required:true,
    },
    difficulty_level:{
        type: String,
        enum: ['easy', 'intermediate', 'hard'],
        required: true,
    },
    status:{
        type: String,
        enum :['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
        due_date: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        required: true,
    },
     type: { 
        type: String,
        enum: ['study', 'soft_skills', 'mental_break', 'physical', 'review', 'other'], // Extended enum for clarity
        required: true,
    },
    icon: { 
        type: String, 
        trim: true,
    },
    mission_id:{
        type: Schema.Types.ObjectId,
        ref: 'Missions',
        required: true
    },
        userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users', 
        required: true,
    },
      createdAt: {
    type: Date,
    default: Date.now
  },

});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;