const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Get records (enquiry/admission) for a specific organization
router.get('/org/:organization_id', async (req, res) => {
  try {
    const { organization_id } = req.params;
    const { type } = req.query;

    const filter = { organization_id };
    if (type) filter.type = type;

    const data = await Record.find(filter).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error('Fetch records failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new record (enquiry or admission)
router.post('/', async (req, res) => {
  try {
    const { organization_id, type } = req.body;
    if (!organization_id || !type) {
      return res.status(400).json({ error: 'organization_id and type are required' });
    }

    const newRecord = new Record(req.body);
    await newRecord.save();

    // Optional: mark related enquiry as converted
    if (req.body._enquiryId && type === 'admission') {
      await Record.findByIdAndUpdate(req.body._enquiryId, {
        convertedToAdmission: true
      });
    }

    res.json(newRecord);
  } catch (err) {
    console.error('Create record failed:', err);
    res.status(500).json({ error: 'Failed to save record' });
  }
});

// Update record
router.put('/:id', async (req, res) => {
  try {
    const updated = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Update record failed:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete record
router.delete('/:id', async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete record failed:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
