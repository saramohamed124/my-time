const mongoose = require('mongoose');

// Define the schema for learning resources
const learningResourceSchema = new mongoose.Schema({
    platform: String,
    channel: String,
    description: String
});

// Define the schema for skills and tools.
// We use 'mongoose.Schema.Types.Mixed' for 'core_skills'
// to handle both array and object data structures.
const skillsAndToolsSchema = new mongoose.Schema({
    core_skills: mongoose.Schema.Types.Mixed,
    additional_skills: String,
    additional_tools: String
});

// Define the schema for a single specialization
const specializationSchema = new mongoose.Schema({
    job_title: String,
    responsibilities: String,
    skills_and_tools: skillsAndToolsSchema,
    learning_resources: [learningResourceSchema]
});

// Define the main schema for engineering disciplines
const engineeringDisciplineSchema = new mongoose.Schema({
    discipline: String,
    specializations: [specializationSchema]
});

// Create the model from the main schema
const EngineeringDiscipline = mongoose.model('EngineeringDiscipline', engineeringDisciplineSchema);
module.exports = EngineeringDiscipline;