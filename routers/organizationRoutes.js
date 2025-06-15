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

// ✅ Register a new Organization (with logo support)
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const {
      center_code,
      organization_title,
      organization_type,
      organization_call_number,
      organization_whatsapp_number,
      organization_whatsapp_message
    } = req.body;

    if (!center_code || !organization_title || !organization_call_number || !organization_type) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const exists = await Organization.findOne({ center_code });
    if (exists) {
      return res.json("exist");
    }

    const newOrg = new Organization({
      organization_uuid: uuid(),
      center_code,
      organization_title,
      organization_type,
      organization_call_number: Number(organization_call_number),
      organization_whatsapp_number: organization_whatsapp_number ? Number(organization_whatsapp_number) : undefined,
      organization_whatsapp_message,
      login_username: center_code,
      login_password: center_code,
      plan_type: "free",
      organization_logo: req.file?.path || "",
    });

    await newOrg.save();
    res.json({ message: "notexist", organization_id: newOrg.organization_uuid });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

module.exports = router;
