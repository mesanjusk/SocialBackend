const express = require('express');
const { v4: uuid } = require('uuid');
const Organization = require('../models/Organization');

const router = express.Router();

// 🟩 Register a new Organization
router.post("/register", async (req, res) => {
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

  try {
    const exists = await Organization.findOne({ center_code });

    if (exists) {
      return res.status(400).json({ success: false, message: "Organization already exists" });
    }

    const newOrg = new Organization({
      organization_uuid: uuid(),
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
    });

    await newOrg.save();
    res.status(201).json({ success: true, message: "Organization registered", data: newOrg });

  } catch (err) {
    console.error("Error registering organization:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 🟦 Login using Organization credentials
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const org = await Organization.findOne({ login_username: username });

    if (!org || org.login_password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      organization_id: org._id,
      organization_title: org.organization_title,
      center_code: org.center_code,
      type: "organization"
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 🔍 Get all organizations (admin use)
router.get("/all", async (req, res) => {
  try {
    const data = await Organization.find({});
    res.json({ success: true, result: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✏️ Update organization by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updated = await Organization.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    res.status(200).json({ success: true, message: "Updated", data: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ❌ Delete organization
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Organization.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
