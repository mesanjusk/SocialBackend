const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// GET all exam entries
router.get('/', examController.getExams);

// POST new exam
router.post('/', examController.createExam);

// PUT update
router.put('/:id', examController.updateExam);

// DELETE exam
router.delete('/:id', examController.deleteExam);

module.exports = router;
