const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

router.post('/', async (req, res) => {
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json(newCourse);
});

router.put('/:id', async (req, res) => {
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
