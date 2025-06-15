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

// Add
router.post("/add", upload.single("image"), async (req, res) => {
  const {
    organization_title,
    organization_whatsapp_number,
    organization_call_number,
    organization_whatsapp_message,
    login_password,
    login_username,
    theme_color,
    organization_type,
    center_code
  } = req.body;

  const organization_logo = req.file ? req.file.path : null;

  try {
    const exists = await Organization.findOne({ center_code });

    if (exists) {
      return res.json("exist");
    }

    const newOrg = new Organization({
      organization_uuid: uuid(),
      organization_title,
      organization_type,
      organization_whatsapp_number,
      organization_call_number,
      organization_whatsapp_message,
      login_password: center_code,
      login_username: center_code,
      organization_logo,
      theme_color,
      center_code
    });

    await newOrg.save();
    res.json("notexist");

  } catch (err) {
    console.error("Error adding organization:", err);
    res.status(500).json("fail");
  }
});

// Get List
router.get("/GetOrganizList", async (req, res) => {
  try {
    const data = await Organization.find({});
    res.json({ success: true, result: data });
  } catch (err) {
    console.error("Error fetching organizations:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ message: 'Organization not found' });

    await Organization.findByIdAndDelete(req.params.id);
    res.json({ message: 'Organization deleted successfully' });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const {
      organization_title,
      organization_whatsapp_number,
      organization_call_number,
      organization_whatsapp_message,
      domains,
      login_username,
      login_password,
      theme_color,
      organization_type
    } = req.body;

    const updateData = {
      organization_title,
      organization_whatsapp_number,
      organization_call_number,
      organization_whatsapp_message,
      login_username,
      login_password,
      theme_color,
      domains: Array.isArray(domains) ? domains : domains?.split(','),
      organization_type
    };

    if (req.file) {
      updateData.organization_logo = req.file.path;
    }

    const updated = await Organization.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Organization not found' });

    res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
