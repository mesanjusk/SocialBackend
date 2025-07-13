const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

// ✅ GET records (enquiry/admission/followup) for a specific institute with pagination
router.get('/org/:institute_id', recordController.getRecords);

// ✅ GET follow-ups for today in IST timezone
router.get('/followup/:institute_id', recordController.getTodayFollowups);

// ✅ Create a new record
router.post('/', recordController.createRecord);

// ✅ Convert enquiry to admission
router.post('/convert/:uuid', recordController.convertToAdmission);

// ✅ Update record
router.put('/:id', recordController.updateRecord);

// ✅ Delete record
router.delete('/:id', recordController.deleteRecord);

module.exports = router;
