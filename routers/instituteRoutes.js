const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Institute = require('../models/institute');
const User = require('../models/User');

// POST /api/institute/signup
router.post('/signup', async (req, res) => {
  try {
    const {
      institute_title,
      institute_type,
      center_code,
      institute_call_number,
      center_head_name,
      theme_color = '#10B981',
      plan_type = 'trial'
    } = req.body;

    if (
      !institute_title ||
      !institute_type ||
      !center_code ||
      !institute_call_number ||
      !center_head_name
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const email = `${institute_call_number}@signup.bt`.toLowerCase();

    // Check if user with same email or center code already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { login_username: center_code }]
    });

    if (existingUser) {
      return res.json({ message: 'exist' });
    }

    // Optional: check if mobile number is already registered
    const existingMobile = await User.findOne({ mobile: String(institute_call_number) });
    if (existingMobile) {
      return res.json({ message: 'duplicate_call_number' });
    }

    const trialExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const instituteUUID = uuidv4();

    // Step 1: Create Institute
    const newInstitute = new Institute({
      institute_uuid: instituteUUID,
      institute_title,
      institute_type,
      center_code,
      institute_call_number,
      center_head_name,
      contactEmail: email,
      trialExpiresAt: trialExpiry,
      plan_type,
      status: 'trial',
      theme: {
        color: theme_color,
        logo: '',
        favicon: ''
      },
      whiteLabel: false,
      modulesEnabled: [],
      users: []
    });

    await newInstitute.save();

    // Step 2: Create Admin User
    const newUser = new User({
      user_uuid: uuidv4(),
      name: center_head_name,
      email,
      mobile: String(institute_call_number),
      login_username: center_code,
      login_password: center_code,
      role: 'admin',
      institute_uuid: instituteUUID,
      isTrial: true,
      trialExpiresAt: trialExpiry,
      theme: {
        primaryColor: theme_color,
        logoUrl: ''
      }
    });

    await newUser.save();

    // Step 3: Link user in Institute
    newInstitute.users = [newUser._id];
    newInstitute.createdBy = newUser._id;
    await newInstitute.save();

    res.json({
      message: 'success',
      institute_title: newInstitute.institute_title,
      institute_uuid: newInstitute.institute_uuid,
      center_code,
      theme_color,
      trialExpiresAt: trialExpiry
    });

  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// GET institute by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await Institute.findOne({ institute_uuid: req.params.id });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE institute profile
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Institute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Updated successfully', updated });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
