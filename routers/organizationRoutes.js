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
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });
const router = express.Router();

// ➕ ADD ORGANIZATION (SIGNUP)
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const {
      center_code,
      organization_title,
      organization_type,
      organization_call_number,
    } = req.body;

    if (!center_code || !organization_title || !organization_type || !organization_call_number) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingCenter = await Organization.findOne({ center_code });
    if (existingCenter) return res.json({ message: "exist" });

    const newOrg = new Organization({
      organization_uuid: uuid(),
      center_code,
      organization_title,
      organization_type,
      organization_call_number,
      login_username: center_code,
      login_password: center_code,
      plan_type: "free",
      organization_logo: req.file?.path || "",
    });

    await newOrg.save();
    res.json({ message: "notexist", organization_id: newOrg.organization_uuid });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.organization_call_number) {
      return res.status(400).json({ message: 'duplicate_call_number' });
    }
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// 🔐 LOGIN ORGANIZATION
router.post('/login', async (req, res) => {
  const { center_code, login_password } = req.body;

  if (!center_code || !login_password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  try {
    const org = await Organization.findOne({ center_code, login_password });

    if (org) {
      return res.json({
        message: 'success',
        organization_id: org.organization_uuid,
        organization_title: org.organization_title,
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
