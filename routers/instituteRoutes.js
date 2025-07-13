const express = require('express');
const router = express.Router();
const instituteController = require('../controllers/instituteController');


// POST /api/institute/signup
router.post('/signup', instituteController.signup);

// GET institute by ID
router.get('/:id', instituteController.getInstitute);

// UPDATE institute profile
// UPDATE institute profile with theme branding
router.put('/update/:id', instituteController.updateInstitute);

router.post('/send-message', instituteController.sendMessage);


module.exports = router;
