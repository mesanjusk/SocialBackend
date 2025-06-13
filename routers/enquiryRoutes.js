import express from 'express';
import Enquiry from '../models/Enquiry.js';

const router = express.Router();

// POST /api/enquiry
router.post('/', async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json({ success: true, message: 'Enquiry added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
