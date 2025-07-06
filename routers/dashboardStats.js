// routers/dashboardStats.js
const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const Admission = require('../models/Admission');
const Course = require('../models/Course');
const Enquiry = require('../models/Enquiry');
const Fees = require('../models/Fees'); // or Transaction, as per your structure
const Followup = require('../models/Lead'); // or Leads, as per your structure
const Attendance = require('../models/Attendance'); // optional

// Utility to get today's date in local timezone
function getTodayRange() {
  const start = new Date();
  start.setHours(0,0,0,0);
  const end = new Date();
  end.setHours(23,59,59,999);
  return { start, end };
}

router.get('/', async (req, res) => {
  try {
    const { start, end } = getTodayRange();

    // You can add filtering by institute if needed via req.user/instituteId etc.

    const [
      students,
      admissions,
      courses,
      enquiries,
      feesToday,
      followupToday,
      attendanceList
    ] = await Promise.all([
      Student.countDocuments(),
      Admission.countDocuments(),
      Course.countDocuments(),
      Enquiry.countDocuments(),
      Fees.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Followup.countDocuments({ followupDate: { $gte: start, $lte: end } }),
      Attendance.find({ date: { $gte: start, $lte: end } })
        .select('name status -_id') // Adjust as per your schema
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
