const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

// GET all admissions
router.get('/', async (req, res) => {
  try {
    const data = await Admission.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ message: 'Failed to fetch admissions' });
  }
});

// POST new admission
router.post('/', async (req, res) => {
  try {
    const newAdmission = new Admission(req.body);
    await newAdmission.save();
    res.status(201).json({ success: true, message: 'Admission created' });
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ message: 'Error saving admission' });
  }
});

// PUT update admission
router.put('/:id', async (req, res) => {
  try {
    await Admission.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true, message: 'Admission updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating admission' });
  }
});

// DELETE admission
router.delete('/:id', async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admission deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting admission' });
  }
});

module.exports = router;
