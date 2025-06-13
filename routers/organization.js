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
  cloudinary: cloudinary,
  params: {
    folder: 'organization',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post("/add", upload.single("image"), async (req, res) => {
  const {
    organization_title,
    organization_whatsapp_number,
    organization_call_number,
    organization_whatsapp_message,
    login_password,
    login_username,
    theme_color,
    domains,  
    org_whatsapp_number,
    org_call_number
  } = req.body;

  const organization_logo = req.file ? req.file.path : null;

  try {
    const check = await Organization.findOne({ organization_call_number });

    if (check) {
      res.json("exist");
    } else {
      const newOrganization = new Organization({
        organization_uuid: uuid(),
        organization_title,
        organization_whatsapp_number,
        organization_call_number,
        organization_whatsapp_message,
        login_password,
        login_username,
        organization_logo,
        theme_color,
        domains,  
        org_whatsapp_number,
        org_call_number
      });

      await newOrganization.save();
      res.json("notexist");
    }
  } catch (e) {
    console.error("Error saving organization:", e);
    res.status(500).json("fail");
  }
});

router.get("/GetOrganizList", async (req, res) => {
    try {
      let data = await Organization.find({});
  
      if (data.length)
        res.json({ success: true, result: data });
      else res.json({ success: false, message: "Organiz Not found" });
    } catch (err) {
      console.error("Error fetching Organiz:", err);
        res.status(500).json({ success: false, message: err });
    }
  });

  router.delete('/:id', async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    await Organization.findByIdAndDelete(req.params.id); 
    res.json({ message: 'Organization deleted successfully' });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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
      org_whatsapp_number,
      org_call_number,
    } = req.body;

    const file = req.file;

    const updateData = {
      organization_title,
      organization_whatsapp_number,
      organization_call_number,
      organization_whatsapp_message,
      login_username,
      login_password,
      theme_color,
      domains: Array.isArray(domains) ? domains : domains?.split(','),
      org_whatsapp_number: {
        number: org_whatsapp_number,
      },
      org_call_number: {
        number: org_call_number,
      },
    };

    if (file) {
      updateData.organization_logo = file.path;
    }

    const updatedOrg = await Organization.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedOrg) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(updatedOrg);
  } catch (err) {
    console.error('Error updating organization:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
