const Batch = require('../models/Batch');
const { v4: uuid } = require('uuid');

exports.getBatches = async (req, res) => {
  try {
    const data = await Batch.find().lean();
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Failed to fetch exams:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createBatch = async (req, res) => {
  try {
    const { name, timing } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name are required' });
    }

    const newBatch = new Batch({ name, timing, Batch_uuid: uuid() });
    await newBatch.save();
    res.status(201).json(newBatch);
  } catch (err) {
    console.error('❌ Failed to create batch:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateBatch = async (req, res) => {
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
};

exports.deleteBatch = async (req, res) => {
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
};
