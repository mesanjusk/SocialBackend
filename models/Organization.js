const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Organization = require('../models/Organization');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Add new organization
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const {
      organization_title,
      organization_whatsapp_number,
      organization_call_number,
      organization_whatsapp_message,
      login_username,
      login_password,
      theme_color,
      domains,
      plan_type,
      created_by,
      organization_type,
      center_code,
      org_whatsapp_number,
      org_call_number
    } = req.body;

    const organization_logo = req.file ? `uploads/${req.file.filename}` : '';

    // Check if organization already exists by center_code
    const existing = await Organization.findOne({ center_code });
    if (existing) return res.send('exist');

    // Parse nested number lists (expected as JSON strings from frontend)
    const parsedWhatsappNumbers = org_whatsapp_number
      ? JSON.parse(org_whatsapp_number)
      : [];

    const parsedCallNumbers = org_call_number
      ? JSON.parse(org_call_number)
      : [];

    const newOrg = new Organization({
      organization_uuid: uuidv4(),
      center_code,
      organization_title,
      organization_whatsapp_number,
      organization_call_number,
      organization_whatsapp_message,
      login_username,
      login_password,
      theme_color,
      domains: domains.split(',').map(d => d.trim()),
      plan_type,
      created_by,
      organization_type,
      organization_logo,
      org_whatsapp_number: parsedWhatsappNumbers,
      org_call_number: parsedCallNumbers
    });

    await newOrg.save();
    res.send('notexist');
  } catch (err) {
    console.error('[Organization Add Error]', err);
    res.status(500).send('server_error');
  }
});

// Get all organizations
router.get('/GetOrganizList', async (req, res) => {
  try {
    const result = await Organization.find().sort({ created_at: -1 });
    res.json({ success: true, result });
  } catch (err) {
    console.error('[GetOrganizList Error]', err);
    res.json({ success: false });
  }
});

module.exports = router;
