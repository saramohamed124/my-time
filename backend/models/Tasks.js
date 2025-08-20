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
    mission_id:{
        type: Schema.Types.ObjectId,
        ref: 'Missions',
        required: true
    }
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;