// routes/publicRoutes.js

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// GET /api/branding
router.get('/branding', publicController.getBranding);

module.exports = router;
