const express = require('express');
const courseCategoryController = require('../controllers/courseCategoryController');
const router = express.Router();

// ✅ GET courseCategory (optionally filter by institute_id)
router.get('/', courseCategoryController.getCourseCategories);

// ✅ POST new courseCategory
router.post('/', courseCategoryController.createCourseCategory);

// ✅ PUT update courseCategory
router.put('/:id', courseCategoryController.updateCourseCategory);

// ✅ DELETE course
router.delete('/:id', courseCategoryController.deleteCourseCategory);

module.exports = router;
