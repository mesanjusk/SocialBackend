const Record = require('../models/Record');

exports.getEnquiriesByInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const data = await Record.find({
      type: 'enquiry',
      institute_id
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error('Fetch enquiries failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createEnquiry = async (req, res) => {
  try {
    const { institute_id } = req.body;
    if (!institute_id) {
      return res.status(400).json({ error: 'institute_id is required' });
    }

    const newEnquiry = new Record({ ...req.body, type: 'enquiry' });
    await newEnquiry.save();

    res.json(newEnquiry);
  } catch (err) {
    console.error('Create enquiry failed:', err);
    res.status(500).json({ error: 'Failed to save enquiry' });
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    const updated = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Update enquiry failed:', err);
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete enquiry failed:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
};
