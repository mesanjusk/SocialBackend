const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Get records (enquiry/admission) for a specific institute
router.get('/org/:institute_id', async (req, res) => {
  try {
    const { institute_id } = req.params;
    const { type } = req.query;

    const filter = { institute_uuid: institute_id }; 
    if (type) filter.type = type;

    const data = await Record.find(filter).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error('Fetch records failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Create new record
router.post('/', async (req, res) => {
  try {
    const { institute_uuid, type } = req.body;
    if (!institute_uuid || type !== 'enquiry') {
      return res.status(400).json({ error: 'Only enquiry records are allowed initially' });
    }

    const newRecord = new Record(req.body);
    await newRecord.save();
    res.json(newRecord);
  } catch (err) {
    console.error('Create enquiry failed:', err);
    res.status(500).json({ error: 'Failed to save enquiry' });
  }
});

router.post('/convert/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const { institute_uuid, admissionData } = req.body;

    const record = await Record.findOne({ uuid, institute_uuid });

    if (!record) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    record.type = 'admission';
    record.convertedToAdmission = true;
    record.admissionDetails.push(admissionData); 

    await record.save();

    res.json({ success: true, message: 'Converted to admission', record });
  } catch (err) {
    console.error('Conversion failed:', err);
    res.status(500).json({ error: 'Failed to convert to admission' });
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
