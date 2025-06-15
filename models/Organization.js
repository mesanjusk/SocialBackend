const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const organizationSchema = new mongoose.Schema({
  organization_uuid: { type: String, default: uuidv4 },
  organization_title: { type: String, required: true },
  center_code: { type: String, required: true, unique: true },
  organization_whatsapp_number: { type: Number, unique: true },
  organization_call_number: { type: Number, unique: true },
  organization_whatsapp_message: String,
  login_username: { type: String, required: true },
  login_password: { type: String, required: true },
  theme_color: String,
  domains: [String],
  org_whatsapp_number: {
    number: String,
    tag: String,
    message: String,
  },
  org_call_number: {
    number: String,
    tag: String
  },
  plan_type: { type: String, enum: ['free', 'paid'], default: 'free' },
  created_by: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Organization', organizationSchema);


// =====================================
// BACKEND: routes/organize.js (partial)
// =====================================
const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const multer = require('multer');
const upload = multer();

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const {
      organization_title,
      center_code,
      organization_whatsapp_number,
      organization_call_number,
      organization_whatsapp_message,
      theme_color,
      login_username,
      login_password,
      domains,
      org_whatsapp_number,
      org_call_number,
      plan_type,
      created_by
    } = req.body;

    const newOrg = new Organization({
      organization_title,
      center_code,
      organization_whatsapp_number,
      organization_call_number,
      organization_whatsapp_message,
      login_username: login_username || center_code, // default
      login_password: login_password || center_code, // default
      theme_color,
      domains: domains ? domains.split(',') : [],
      org_whatsapp_number: org_whatsapp_number ? JSON.parse(org_whatsapp_number) : {},
      org_call_number: org_call_number ? JSON.parse(org_call_number) : {},
      plan_type,
      created_by
    });

    await newOrg.save();
    res.json({ success: true, result: newOrg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
