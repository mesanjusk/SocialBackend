// routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET all leads by type
router.get('/:type', async (req, res) => {
  try {
    const leads = await Lead.find({ type: req.params.type }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leads' });
  }
});

// POST new lead
router.post('/', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.json(newLead);
  } catch (err) {
    res.status(500).json({ message: 'Error saving lead' });
  }
});

// PUT update lead
router.put('/:id', async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating lead' });
  }
});

// DELETE lead
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting lead' });
  }
});

module.exports = router;
