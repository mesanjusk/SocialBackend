const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');
const { v4: uuid } = require("uuid");

// 📥 GET all batches (optionally filtered by institute_id)
router.get('/', async (req, res) => {
  try {
    const { institute_uuid } = req.query;
    const query = institute_uuid ? { institute_uuid } : {};

    const batches = await Batch.find(query).lean();
    res.status(200).json(batches);
  } catch (err) {
    console.error('❌ Failed to fetch batches:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ➕ POST new batch
router.post('/', async (req, res) => {
  try {
    const { institute_uuid, name, timing } = req.body;
    if (!institute_uuid || !name) {
      return res.status(400).json({ error: 'institute_id and name are required' });
    }

    const newBatch = new Batch({ institute_uuid, name, timing, Batch_uuid: uuid() });
    await newBatch.save();
    res.status(201).json(newBatch);
  } catch (err) {
    console.error('❌ Failed to create batch:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✏️ PUT update batch
router.put('/:id', async (req, res) => {
  try {
    const updated = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Failed to update batch:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ❌ DELETE batch
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Batch.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.status(200).json({ success: true, message: 'Batch deleted' });
  } catch (err) {
    console.error('❌ Failed to delete batch:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
