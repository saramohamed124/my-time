const mongoose = require('mongoose');

// Define the schema for learning resources
const youTubeResourceSchema = new mongoose.Schema({
    channel: String,
    language: String,
    content: String
});

// Define the schema for the required skills object
// We use 'mongoose.Schema.Types.Mixed' to handle the various key-value pairs
// within the 'required_skills' object, as its structure changes.
const requiredSkillsSchema = new mongoose.Schema({
    languages: mongoose.Schema.Types.Mixed,
    frameworks: mongoose.Schema.Types.Mixed,
    databases: mongoose.Schema.Types.Mixed,
    tools: mongoose.Schema.Types.Mixed,
    networking: String,
    operating_systems: String,
    other_skills: String
});

// Define the schema for a single specialization within a field
const specializationSchema = new mongoose.Schema({
    specialization: String,
    tasks: String,
    required_skills: requiredSkillsSchema,
    youtube_resources: [youTubeResourceSchema]
});

// Define the main schema for a computer science field
const computerScienceFieldSchema = new mongoose.Schema({
    field: String,
    description: String,
    specializations: [specializationSchema]
});

// Create the model from the main schema
const ComputerScienceField = mongoose.model('ComputerScienceField', computerScienceFieldSchema);
module.exports = ComputerScienceField;
