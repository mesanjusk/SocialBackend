const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');

// GET batches (optionally filter by organization_id)
router.get('/', async (req, res) => {
  try {
    const { organization_id } = req.query;
    const query = organization_id ? { organization_id } : {};
    const data = await Batch.find(query);
    res.json(data);
  } catch (err) {
    console.error('Failed to fetch batches:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new batch
router.post('/', async (req, res) => {
  try {
    const { organization_id, name, timing } = req.body;
    if (!organization_id || !name) {
      return res.status(400).json({ error: 'organization_id and name are required' });
    }
    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    console.error('Failed to create batch:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update batch
router.put('/:id', async (req, res) => {
  try {
    const updated = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Failed to update batch:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE batch
router.delete('/:id', async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete batch:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
