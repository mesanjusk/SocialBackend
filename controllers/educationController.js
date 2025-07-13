const Education = require('../models/Education');

exports.getEducations = async (req, res) => {
  try {
    const data = await Education.find().lean();
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Failed to fetch education entries:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createEducation = async (req, res) => {
  try {
    const { education, description } = req.body;
    if (!education) return res.status(400).json({ error: 'Education is required' });

    const newEntry = new Education({ education, description });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('❌ Failed to create education:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const updated = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Entry not found' });
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Failed to update education:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const deleted = await Education.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Entry not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error('❌ Failed to delete education:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
