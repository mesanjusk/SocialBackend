const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const Admission = require('../models/Admission');
const Course = require('../models/Course');
const Lead = require('../models/Lead');
const Fees = require('../models/Fees');
const Followup = require('../models/Lead');
const Attendance = require('../models/Attendance');

// Get today's start and end date
function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

router.get('/', async (req, res) => {
  try {
    const { start, end } = getTodayRange();
    const { institute_uuid } = req.query;

    if (!institute_uuid) {
      return res.status(400).json({ error: 'Missing institute_uuid' });
    }

    const [
      students,
      admissions,
      courses,
      enquiries,
      feesToday,
      followupToday,
      attendanceList
    ] = await Promise.all([
      Student.countDocuments({ institute_uuid }),            
      Admission.countDocuments({ institute_uuid }),         
      Course.countDocuments(),            
      Lead.countDocuments({ institute_uuid }),          
      Fees.aggregate([
        { $match: { institute_uuid, date: { $gte: start, $lte: end } } }, 
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Followup.countDocuments({ institute_uuid, followupDate: { $gte: start, $lte: end } }),
      Attendance.find({ institute_uuid, date: { $gte: start, $lte: end } })
        .select('name status -_id')
        .limit(8)
    ]);

    res.json({
      students,
      admissions,
      courses,
      enquiries,
      feesToday: (feesToday[0]?.total ?? 0),
      followupToday,
      attendance: attendanceList
    });
    

  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Dashboard stats error' });
  }
});

module.exports = router;
