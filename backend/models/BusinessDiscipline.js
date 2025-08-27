const mongoose = require('mongoose');
// Define the schema for YouTube resources
const youtubeResourceSchema = new mongoose.Schema({
    channel: String,
    language: String,
    content: String
});

// Define the schema for required skills and tools
const requiredSkillsSchema = new mongoose.Schema({
    skills: [String],
    tools: [String],
    principles: String,
    software: [String],
    methodologies: [String],
    databases: String,
    programming_knowledge: String,
});

// Define the schema for a single specialization
const specializationSchema = new mongoose.Schema({
    specialization: String,
    tasks: String,
    required_skills: requiredSkillsSchema,
    youtube_resources: [youtubeResourceSchema]
});

// Define the main schema for business administration disciplines
const businessDisciplineSchema = new mongoose.mongoose.Schema({
    discipline: String,
    description: String,
    specializations: [specializationSchema]
});

// Create the model from the main schema
const BusinessDiscipline = mongoose.model('BusinessDiscipline', businessDisciplineSchema);
module.exports = BusinessDiscipline;