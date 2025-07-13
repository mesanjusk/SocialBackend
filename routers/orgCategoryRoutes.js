const express = require('express');
const router = express.Router();
const orgCategoryController = require('../controllers/orgCategoryController');

// GET all categories
router.get('/', orgCategoryController.getCategories);

// POST new category
router.post('/', orgCategoryController.createCategory);

// PUT update category
router.put('/:id', orgCategoryController.updateCategory);

// DELETE category
router.delete('/:id', orgCategoryController.deleteCategory);

module.exports = router;
