// routes/publicRoutes.js

const express = require('express');
const router = express.Router();

// GET /api/branding
router.get('/branding', (req, res) => {
  res.json({
    institute: req.institute?.institute_title || null,
    theme: req.theme,
    favicon: req.theme?.favicon || '',
    logo: req.theme?.logo || '',
    color: req.theme?.color || ' #ffffff'
  });
});

module.exports = router;
