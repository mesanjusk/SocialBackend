const express = require('express');
const Enquiry = require('../models/Enquiry');

const router = express.Router();

// POST /api/enquiry - Create new enquiry
router.post('/', async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json({ success: true, message: 'Enquiry added', data: enquiry });
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/enquiry - Fetch all enquiries
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries' });
  }
});

// PUT /api/enquiry/:id - Update an enquiry
router.put('/:id', async (req, res) => {
  try {
    const updated = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry updated', data: updated });
  } catch (error) {
    console.error('PUT error:', error);
    res.status(500).json({ success: false, message: 'Failed to update enquiry' });
  }
});

// DELETE /api/enquiry/:id - Delete an enquiry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete enquiry' });
  }
});

module.exports = router;
