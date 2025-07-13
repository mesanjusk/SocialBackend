const express = require('express');
const router = express.Router();
const instituteController = require('../controllers/instituteController');

router.post('/signup', instituteController.signup);

module.exports = router;
