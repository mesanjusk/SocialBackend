const Admission = require('../models/Admission');
const { v4: uuidv4 } = require('uuid');

// Create Admission
exports.createAdmission = async (req, res) => {
  try {
    const admission = new Admission({
      uuid: uuidv4(),
      ...req.body,
      createdBy: req.user ? req.user.name : 'System'
    });

    await admission.save();
    res.status(201).json({ success: true, data: admission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get All Admissions
exports.getAdmissions = async (req, res) => {
  try {
    const { institute_uuid } = req.query;
    const admissions = await Admission.find(institute_uuid ? { institute_uuid } : {});
    res.json({ success: true, data: admissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get Single Admission
exports.getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findOne({ uuid: req.params.uuid });
    if (!admission) return res.status(404).json({ success: false, message: 'Admission not found' });
    res.json({ success: true, data: admission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
