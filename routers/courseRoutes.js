const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

// ✅ GET courses (optionally filter by institute_id)
router.get('/', async (req, res) => {
  try {
    const { institute_uuid } = req.query;
    const query = institute_uuid ? { institute_uuid } : {};
    const courses = await Course.find(query);
    res.json(courses);
  } catch (err) {
    console.error('Failed to fetch courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST new course
router.post('/', async (req, res) => {
  try {
    const { name, institute_uuid } = req.body;
    if (!name || !institute_uuid) {
      return res.status(400).json({ error: 'name and institute_id are required' });
    }

    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    console.error('Failed to create course:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ PUT update course
router.put('/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Failed to update course:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ DELETE course
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete course:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
