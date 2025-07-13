const express = require('express');
const router = express.Router();
const brandingController = require('../controllers/brandingController');

// GET /api/branding?i=insti_id_or_subdomain
router.get('/', brandingController.getBranding);

module.exports = router;
