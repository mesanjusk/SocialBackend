const CourseCategory = require('../models/courseCategory');

exports.getCourseCategories = async (req, res) => {
  try {
    const { courseCategory_uuid } = req.query;
    const query = courseCategory_uuid ? { courseCategory_uuid } : {};
    const courses = await CourseCategory.find(query);
    res.json(courses);
  } catch (err) {
    console.error('Failed to fetch courseCategory:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createCourseCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name are required' });
    }

    const newCourse = new CourseCategory(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    console.error('Failed to create courseCategory:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCourseCategory = async (req, res) => {
  try {
    const updated = await CourseCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Failed to update course:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCourseCategory = async (req, res) => {
  try {
    await CourseCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete course:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

