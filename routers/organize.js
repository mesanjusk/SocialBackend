const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// POST /api/organize/add
router.post('/add', async (req, res) => {
  try {
    const {
      organization_title,
      organization_type,
      center_code,
      organization_call_number,
      mobile_number,
      theme_color
    } = req.body;

    // Validate required fields
    if (!organization_title || !organization_type || !center_code || !organization_call_number || !mobile_number) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for duplicate center code
    const existingOrg = await Organization.findOne({ center_code });
    if (existingOrg) {
      return res.status(400).json({ message: 'exist' });
    }

    // Check for duplicate mobile number (admin user)
    const existingMobile = await User.findOne({ mobile: mobile_number });
    if (existingMobile) {
      return res.status(400).json({ message: 'duplicate_call_number' });
    }

    // Create new organization
    const newOrg = new Organization({
      organization_uuid: uuidv4(),
      organization_title,
      organization_type,
      center_code,
      organization_call_number,
      theme_color: theme_color || '#10B981',
      domains: [],
      login_username: center_code,
      login_password: center_code,
      plan_type: 'free',
      created_by: 'self',
    });

    const savedOrg = await newOrg.save();

    // Create default admin user (login = center_code)
    const newUser = new User({
      name: organization_title,
      mobile: mobile_number,
      login_username: center_code,
      login_password: center_code,
      type: 'admin',
      organization_id: savedOrg._id,
    });

    await newUser.save();

    res.status(201).json({
      message: 'success',
      organization_id: savedOrg._id,
      organization_title: savedOrg.organization_title,
      center_code: savedOrg.center_code,
      theme_color: savedOrg.theme_color,
    });
  } catch (err) {
    console.error('Signup error:', err.message || err);
    res.status(500).json({ message: err.message || 'server_error' });
  }
});

module.exports = router;
