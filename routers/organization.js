const express = require('express');
const { v4: uuid } = require('uuid');
const Organization = require('../models/Organization');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'organization',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage });
const router = express.Router();

// ✅ Add New Organization
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const {
      center_code,
      organization_title,
      organization_type,
      organization_call_number,
      organization_whatsapp_number,
      organization_whatsapp_message,
      login_username,
      login_password,
      theme_color,
      domains,
      plan_type,
      org_whatsapp_number,
      org_call_number
    } = req.body;

    // ✅ Prevent duplicate center code
    const exists = await Organization.findOne({ center_code });
    if (exists) return res.json("exist");

    // ✅ Prepare organization object
    const newOrg = new Organization({
      organization_uuid: uuid(),
      center_code,
      organization_title,
      organization_type,
      organization_call_number,
      organization_whatsapp_message,
      login_username: login_username || center_code,
      login_password: login_password || center_code,
      theme_color,
      domains: domains?.split(',').map(d => d.trim()).filter(Boolean),
      plan_type: plan_type || 'free',
      organization_logo: req.file ? req.file.path : null,
      org_whatsapp_number: org_whatsapp_number ? JSON.parse(org_whatsapp_number) : [],
      org_call_number: org_call_number ? JSON.parse(org_call_number) : []
    });

    // ✅ Only assign WhatsApp number if it exists (avoid duplicate null)
    if (organization_whatsapp_number) {
      newOrg.organization_whatsapp_number = organization_whatsapp_number;
    }

    await newOrg.save();
    res.json("notexist");
  } catch (err) {
    console.error("Error adding organization:", err);
    res.status(500).json("fail");
  }
});

module.exports = router;
