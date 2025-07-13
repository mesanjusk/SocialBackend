const Exam = require('../models/Exam');

exports.getExams = async (req, res) => {
  try {
    const data = await Exam.find().lean();
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Failed to fetch exams:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createExam = async (req, res) => {
  try {
    const { exam, description } = req.body;
    if (!exam) return res.status(400).json({ error: 'Exam is required' });

    const newExam = new Exam({ exam, description });
    await newExam.save();
    res.status(201).json(newExam);
  } catch (err) {
    console.error('❌ Failed to create exam:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Exam not found' });
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Failed to update exam:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const deleted = await Exam.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Exam not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error('❌ Failed to delete exam:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
