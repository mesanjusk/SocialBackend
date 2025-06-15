const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Get all admissions for a specific organization
router.get('/org/:organization_id', async (req, res) => {
  try {
    const { organization_id } = req.params;
    const data = await Record.find({
      type: 'admission',
      organization_id
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error('Fetch admissions failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new admission (from form or converted enquiry)
router.post('/', async (req, res) => {
  try {
    const { organization_id } = req.body;
    if (!organization_id) {
      return res.status(400).json({ error: 'organization_id is required' });
    }

    const newAdmission = new Record({ ...req.body, type: 'admission' });
    await newAdmission.save();

    // Optional: mark related enquiry as converted
    if (req.body._enquiryId) {
      await Record.findByIdAndUpdate(req.body._enquiryId, {
        convertedToAdmission: true
      });
    }

    res.json(newAdmission);
  } catch (err) {
    console.error('Create admission failed:', err);
    res.status(500).json({ error: 'Failed to save admission' });
  }
});

// Update admission
router.put('/:id', async (req, res) => {
  try {
    const updated = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Update admission failed:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete admission
router.delete('/:id', async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete admission failed:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
