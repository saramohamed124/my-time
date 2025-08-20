const mongoose = require('mongoose');
const { Schema } = mongoose;

const MissionSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    start_date:{
        type: Date,
        required:true,
    },
    end_date:{
        type: Date,
        required: true,
    },
    status:{
        type: String,
        enum :['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    tasks:[{
        type: Schema.Types.ObjectId,
        ref: 'Tasks',
        required: true
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users', 
        required: true,
    }
});

const Missions = mongoose.model('Missions', MissionSchema);
module.exports = Missions;