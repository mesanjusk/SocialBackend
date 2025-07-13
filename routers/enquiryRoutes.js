const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

// 🔹 Get all enquiries for a specific institute
router.get('/org/:institute_id', enquiryController.getEnquiriesByInstitute);

// 🔹 Create new enquiry
router.post('/', enquiryController.createEnquiry);

// 🔹 Update enquiry
router.put('/:id', enquiryController.updateEnquiry);

// 🔹 Delete enquiry
router.delete('/:id', enquiryController.deleteEnquiry);

module.exports = router;
