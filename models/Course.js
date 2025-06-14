// models/Course.js
const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  name: String,
  description: String,
}, { timestamps: true });
module.exports = mongoose.model('Course', courseSchema);
