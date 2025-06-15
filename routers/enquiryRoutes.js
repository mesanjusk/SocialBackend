const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Get all enquiries for a specific organization (not converted)
router.get('/org/:organization_id', async (req, res) => {
  try {
    const { organization_id } = req.params;
    const data = await Record.find({
      type: 'enquiry',
      organization_id,
      convertedToAdmission: false
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error('Fetch enquiries failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new enquiry
router.post('/', async (req, res) => {
  try {
    const { organization_id } = req.body;
    if (!organization_id) {
      return res.status(400).json({ error: 'organization_id is required' });
    }

    const newEnquiry = new Record({ ...req.body, type: 'enquiry' });
    await newEnquiry.save();

    res.json(newEnquiry);
  } catch (err) {
    console.error('Create enquiry failed:', err);
    res.status(500).json({ error: 'Failed to save enquiry' });
  }
});

// Update enquiry
router.put('/:id', async (req, res) => {
  try {
    const updated = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Update enquiry failed:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete enquiry
router.delete('/:id', async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete enquiry failed:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
