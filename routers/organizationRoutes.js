// organizationRoutes.js
const express = require('express');
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

// 🔄 UPDATE ORGANIZATION
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const {
      organization_title,
      organization_call_number,
      organization_whatsapp_number,
      organization_whatsapp_message,
      domains,
      theme_color,
      plan_type,
      organization_type
    } = req.body;

    const updateData = {
      organization_title,
      organization_call_number,
      organization_whatsapp_number,
      organization_whatsapp_message,
      theme_color,
      organization_type,
      plan_type: plan_type || 'free',
      domains: domains?.split(',').map(d => d.trim()).filter(Boolean),
    };

    if (req.file) updateData.organization_logo = req.file.path;

    const updated = await Organization.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json({ success: true, message: "Updated successfully", result: updated });
  } catch (err) {
    console.error("Update error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate field", duplicate: err.keyValue });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// 📥 GET ALL ORGANIZATIONS (for Admin panel)
router.get('/GetOrganizList', async (req, res) => {
  try {
    const data = await Organization.find().sort({ createdAt: -1 });
    res.json({ success: true, result: data });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

