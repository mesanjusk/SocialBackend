const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// GET all enquiries
router.get('/', async (req, res) => {
  try {
    const data = await Record.find({ type: 'enquiry' }).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new enquiry
router.post('/', async (req, res) => {
  try {
    const enquiry = new Record({ ...req.body, type: 'enquiry' });
    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (err) {
    console.error('Error creating enquiry:', err);
    res.status(500).json({ error: 'Could not create enquiry' });
  }
});

// PUT update enquiry
router.put('/:id', async (req, res) => {
  try {
    const updated = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Enquiry not found' });
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating enquiry:', err);
    res.status(500).json({ error: 'Could not update enquiry' });
  }
});

// DELETE enquiry
router.delete('/:id', async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting enquiry:', err);
    res.status(500).json({ error: 'Could not delete enquiry' });
  }
});

module.exports = router;
