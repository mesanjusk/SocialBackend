const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Get all admissions
router.get('/', async (req, res) => {
  const data = await Record.find({ type: 'admission' }).sort({ createdAt: -1 });
  res.json(data);
});

// Create new admission
router.post('/', async (req, res) => {
  const admission = new Record({ ...req.body, type: 'admission' });
  await admission.save();
  res.json(admission);
});

// Update admission
router.put('/:id', async (req, res) => {
  const updated = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete admission
router.delete('/:id', async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
