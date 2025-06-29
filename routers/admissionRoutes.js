const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admissionController');

router.post('/', admissionController.createAdmission);
router.get('/', admissionController.getAdmissions);
router.get('/:uuid', admissionController.getAdmission);

module.exports = router;
