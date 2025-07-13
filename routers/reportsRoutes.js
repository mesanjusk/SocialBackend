const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// Outstanding Balance Report
router.get('/outstanding/:institute_uuid', reportsController.getOutstandingReport);

module.exports = router;
