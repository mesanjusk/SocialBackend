const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const Institute = require('../models/institute');
// Use correct case-sensitive path for the User model
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  try {
    const {
      organization_title,
      organization_type,
      center_code,
      mobile_number,
      center_head_name,
      theme_color = '#10B981',
      plan_type = 'trial'
    } = req.body;

    if (!organization_title || !organization_type || !center_code || !mobile_number || !center_head_name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const email = `${mobile_number}@signup.bt`;
    const existingUser = await User.findOne({ $or: [{ email }, { login_username: center_code }] });
    if (existingUser) return res.json({ message: 'exist' });

    const trialExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const instituteUUID = uuidv4();

    // 1. Create Institute
    const newInstitute = new Institute({
      uuid: instituteUUID,
      name: organization_title,
      type: organization_type,
      contactEmail: email,
      trialExpiresAt: trialExpiry,
      status: 'trial',
      theme: {
        color: theme_color,
        logo: '',
        favicon: ''
      },
      whiteLabel: false,
      modulesEnabled: []
    });
    await newInstitute.save();

    // 2. Create User
    const hashedPassword = await bcrypt.hash(center_code, 10);

    const newUser = new User({
      user_uuid: uuidv4(),
      name: center_head_name,
      email,
      mobile: mobile_number,
      login_username: center_code,
      login_password: hashedPassword,
      role: 'admin',
      instituteId: newInstitute._id,
      isTrial: true,
      trialExpiresAt: trialExpiry,
      theme: {
        primaryColor: theme_color,
        logoUrl: ''
      }
    });

    await newUser.save();

    newInstitute.users.push(newUser._id);
    newInstitute.createdBy = newUser._id;
    await newInstitute.save();

    res.json({
      message: 'success',
      organization_title: newInstitute.name,
      organization_id: newInstitute.uuid,
      center_code: center_code,
      theme_color: theme_color,
      trialExpiresAt: trialExpiry
    });

  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

module.exports = router;
