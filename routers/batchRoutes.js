const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');

router.get('/', async (req, res) => {
  const data = await Batch.find();
  res.json(data);
});

router.post('/', async (req, res) => {
  const batch = new Batch(req.body);
  await batch.save();
  res.status(201).json(batch);
});

router.put('/:id', async (req, res) => {
  const updated = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Batch.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
