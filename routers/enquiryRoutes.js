const express = require('express');
const Enquiry = require('../models/Enquiry').default; // ✅ Add .default here

const router = express.Router();

// GET
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries' });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json({ success: true, message: 'Enquiry added' });
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
