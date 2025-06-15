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

    // ✅ Only assign if not empty
    if (organization_whatsapp_number?.trim()) {
      newOrg.organization_whatsapp_number = organization_whatsapp_number;
    }

    await newOrg.save();
    res.json("notexist");
  } catch (err) {
    console.error("Error adding organization:", err);
    res.status(500).json("fail");
  }
});


// ✅ Update Organization by ID — allows clearing whatsapp number
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
      plan_type,
      organization_type,
      org_whatsapp_number,
      org_call_number,
    } = req.body;

    if (!organization_title || !organization_call_number) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const updateData = {
      organization_title,
      organization_call_number,
      organization_whatsapp_message,
      login_username,
      login_password,
      theme_color,
      organization_type,
      plan_type: plan_type || 'free',
      domains: domains?.split(',').map((d) => d.trim()).filter(Boolean),
      org_whatsapp_number: org_whatsapp_number ? JSON.parse(org_whatsapp_number) : [],
      org_call_number: org_call_number ? JSON.parse(org_call_number) : []
    };

    if (req.file) {
      updateData.organization_logo = req.file.path;
    }

    // ✅ Main logic: clear if empty, otherwise update
    if (organization_whatsapp_number?.trim()) {
      updateData.organization_whatsapp_number = organization_whatsapp_number;
    } else {
      // clear the field in MongoDB using $unset
      await Organization.findByIdAndUpdate(req.params.id, {
        $unset: { organization_whatsapp_number: "" }
      });
    }

    // ✅ Then update other fields normally
    const updated = await Organization.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json({ success: true, message: 'Updated successfully', result: updated });
  } catch (err) {
    console.error('Error updating organization:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate entry for unique field', duplicate: err.keyValue });
    }
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
