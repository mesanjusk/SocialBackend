const Lead = require('../models/Lead');
const Student = require('../models/Student');
const { v4: uuidv4 } = require('uuid');

// Create Lead with Auto Student Linking
exports.createLead = async (req, res) => {
  try {
    const { institute_uuid, studentData, leadData } = req.body;

    let student = await Student.findOne({
      institute_uuid,
      mobileSelf: studentData.mobileSelf
    });

    if (!student) {
      student = new Student({
        uuid: uuidv4(),
        institute_uuid,
        ...studentData,
        createdBy: req.user ? req.user.name : 'System'
      });
      await student.save();
    }

    const lead = new Lead({
      uuid: uuidv4(),
      institute_uuid,
      student_uuid: student.uuid,
      ...leadData,
      createdBy: req.user ? req.user.name : 'System'
    });

    await lead.save();
    res.status(201).json({ success: true, data: { lead, student } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get All Leads with joined student data
exports.getLeads = async (req, res) => {
  try {
    const { institute_uuid } = req.query;
    const leads = await Lead.aggregate([
      { $match: institute_uuid ? { institute_uuid } : {} },
      {
        $lookup: {
          from: 'students',
          localField: 'student_uuid',
          foreignField: 'uuid',
          as: 'studentData'
        }
      },
      { $unwind: "$studentData" },
      { $sort: { createdAt: -1 } }
    ]);
    res.json({ success: true, data: leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get Single Lead
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ uuid: req.params.uuid });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update Lead Status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { leadStatus } = req.body;
    await Lead.findOneAndUpdate({ uuid }, { leadStatus });
    res.json({ success: true, message: 'Lead status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
