const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');
const Organization = require('../models/Organization');

// Multer setup for optional image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// POST /api/organize/add – Signup (minimal fields)
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const {
      organization_title,
      organization_call_number,
      organization_type,
      center_code
    } = req.body;

    if (!organization_title || !organization_call_number || !organization_type || !center_code) {
      return res.status(400).send('missing_fields');
    }

    // Check uniqueness of center_code
    const existing = await Organization.findOne({ center_code });
    if (existing) return res.send('exist');

    const organization_logo = req.file ? `uploads/${req.file.filename}` : '';

    const newOrg = new Organization({
      organization_uuid: uuidv4(),
      center_code,
      organization_title,
      organization_call_number,
      organization_type,
      login_username: center_code,
      login_password: center_code,
      organization_logo,
      plan_type: 'free',
      created_by: 'self-signup',
      created_at: new Date(),
      domains: [],
      organization_whatsapp_number: null,
      organization_whatsapp_message: '',
      theme_color: '',
      org_whatsapp_number: [],
      org_call_number: []
    });

    await newOrg.save();
    res.send('notexist');
  } catch (err) {
    console.error('[Signup Add Error]', err);
    res.status(500).send('server_error');
  }
});

// GET /api/organize/GetOrganizList
router.get('/GetOrganizList', async (req, res) => {
  try {
    const result = await Organization.find().sort({ created_at: -1 });
    res.json({ success: true, result });
  } catch (err) {
    console.error('[GetOrganizList Error]', err);
    res.json({ success: false });
  }
});

module.exports = mongoose.model('Organization', organizationSchema);

