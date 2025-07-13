const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');

// GET all education entries
router.get('/', educationController.getEducations);

// POST new entry
router.post('/', educationController.createEducation);

// PUT update
router.put('/:id', educationController.updateEducation);

// DELETE entry
router.delete('/:id', educationController.deleteEducation);

module.exports = router;
