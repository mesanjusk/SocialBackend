const express = require('express');
const { v4: uuid } = require('uuid');
const User = require('../models/User');
const Organization = require('../models/Organization');
const resolveOrganization = require('../middleware/resolveOrganization');

const router = express.Router();

//
// ✅ PUBLIC ROUTES (no middleware)
//

router.post('/organization/login', async (req, res) => {
  try {
    const { center_code, password } = req.body;

    const user = await User.findOne({
      login_username: center_code,
      login_password: password
    }).populate('organization_id');

    if (!user) return res.status(401).json({ message: 'invalid' });

    user.last_login_at = new Date();
    await user.save();

    res.status(200).json({
      message: 'success',
      user_id: user._id,
      user_name: user.name,
      user_type: user.type,
      organization_id: user.organization_id._id,
      organization_title: user.organization_id.organization_title,
      center_head_name: user.organization_id.center_head_name,
      center_code: user.organization_id.center_code,
      theme_color: user.organization_id.theme_color
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'server_error' });
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      login_username: username,
      login_password: password
    }).populate('organization_id');

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    user.last_login_at = new Date();
    await user.save();

    res.status(200).json({
      message: 'success',
      user_id: user._id,
      user_name: user.name,
      user_type: user.type,
      organization_id: user.organization_id._id,
      organization_title: user.organization_id.organization_title,
      theme_color: user.organization_id.theme_color,
      last_password_change: user.last_password_change || null
    });
  } catch (err) {
    console.error('User login error:', err);
    res.status(500).json({ message: 'server_error' });
  }
});

router.post('/organization/forgot-password', async (req, res) => {
  try {
    const { center_code, mobile } = req.body;

    const user = await User.findOne({
      login_username: center_code,
      mobile
    });

    if (!user) return res.status(404).json({ message: 'No matching user found' });

    res.status(200).json({ message: 'verified', user_id: user._id });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'server_error' });
  }
});

router.post('/organization/reset-password/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.login_password = new_password;
    await user.save();

    res.status(200).json({ message: 'reset_success' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'server_error' });
  }
});

router.post('/register', async (req, res) => {
  const { name, password, mobile, type, organization_id } = req.body;

  if (!organization_id) {
    return res.status(400).json({ success: false, message: 'organization_id is required' });
  }

  try {
    const existingUser = await User.findOne({ mobile });
    if (existingUser) return res.json('exist');

    const newUser = new User({
      name,
      mobile,
      type,
      login_username: mobile,
      login_password: password,
      user_uuid: uuid(),
      organization_id
    });

    await newUser.save();
    res.json('notexist');
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json('fail');
  }
});

// ✅ PUBLIC: Get users by org_id (moved above middleware)
router.get('/GetUserList/:organization_id', async (req, res) => {
  const { organization_id } = req.params;
  try {
    const users = await User.find({ organization_id });
    res.json(users.length ? { success: true, result: users } : { success: false, message: 'No users found' });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

//
// ✅ PROTECTED ROUTES (require resolved org context)
//
router.use(resolveOrganization);

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(user ? 200 : 404).json(user ? { success: true, result: user } : { success: false, message: 'User not found' });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, message: 'Error fetching user', error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { name, mobile, type, password } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { name, mobile, type, password },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, message: 'User updated successfully', result: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Error updating user', error: err.message });
  }
});

module.exports = router;
