const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Get all enquiries
router.get('/', async (req, res) => {
  const data = await Record.find({ type: 'enquiry' }).sort({ createdAt: -1 });
  res.json(data);
});

// Create new enquiry
router.post('/', async (req, res) => {
  const enquiry = new Record({ ...req.body, type: 'enquiry' });
  await enquiry.save();
  res.json(enquiry);
});

// Update enquiry
router.put('/:id', async (req, res) => {
  const updated = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete enquiry
router.delete('/:id', async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
