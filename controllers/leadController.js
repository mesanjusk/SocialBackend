const Lead = require('../models/Lead');
const Student = require('../models/Student');
const { v4: uuidv4 } = require('uuid');

exports.createLead = async (req, res) => {
  try {
    console.log('📦 Incoming payload:', req.body);
    const {
      institute_uuid,
      student_uuid,
      studentData,
      admission_uuid,
      enquiryDate,
      followupDate,
      course,
      referredBy,
      createdBy,
      followups
    } = req.body;

    let student;

    if (student_uuid) {
      student = await Student.findOne({ uuid: student_uuid, institute_uuid });
      if (!student) {
        return res.status(400).json({
          success: false,
          message: 'Invalid student_uuid or not found',
        });
      }
    } else {
      if (!institute_uuid || !studentData || !studentData.mobileSelf) {
        return res.status(400).json({
          success: false,
          message: 'Missing required data: institute_uuid or mobileSelf',
        });
      }

      student = await Student.findOne({
        institute_uuid,
        mobileSelf: studentData.mobileSelf,
      });

      if (!student) {
        student = new Student({
          uuid: uuidv4(),
          institute_uuid,
          ...studentData,
          course: studentData.course,
          createdBy: req.user ? req.user.name : 'System',
        });
        await student.save();
      }
    }

    const lead = new Lead({
      Lead_uuid: uuidv4(),
      institute_uuid,
      student_uuid: student.uuid,
      course: course || studentData?.course || student?.course,
      admission_uuid: admission_uuid || null,
      enquiryDate: enquiryDate || new Date(),
      followupDate: followupDate,
      referredBy: referredBy || '',
      followups: Array.isArray(followups) ? followups : [],
      createdBy: createdBy || (req.user ? req.user.name : 'System'),
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

// Update Lead Status and add followup entry
exports.updateLeadStatus = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { leadStatus, remark, createdBy = 'System' } = req.body;

    const validStatuses = ['open', 'follow-up', 'converted', 'lost'];
    if (!validStatuses.includes(leadStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid lead status' });
    }

    const lead = await Lead.findOne({ uuid });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    lead.leadStatus = leadStatus;

    lead.followups.push({
      date: new Date(),
      status: leadStatus,
      remark: remark || '',
      createdBy,
      createdAt: new Date()
    });

    await lead.save();

    res.json({ success: true, message: 'Lead status and followup updated' });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
