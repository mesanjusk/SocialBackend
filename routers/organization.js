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

module.exports = router;
