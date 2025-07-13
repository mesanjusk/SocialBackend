const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/addAttendance/:institute_uuid', attendanceController.addAttendance);
router.get('/GetAttendanceList', attendanceController.getAttendanceList);
router.get('/getTodayAttendance/:userName', attendanceController.getTodayAttendance);

module.exports = router;
