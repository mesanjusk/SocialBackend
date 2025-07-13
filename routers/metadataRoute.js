const express = require('express');
const router = express.Router();
const metadataController = require('../controllers/metadataController');

router.get('/', metadataController.getMetadata);

module.exports = router;
