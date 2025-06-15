const express = require('express');
const { v4: uuid } = require('uuid');
const User = require('../models/User');

const router = express.Router();

// ➕ Register new user (by organization)
router.post("/register", async (req, res) => {
  const { name, password, mobile, type, organization_id } = req.body;

  if (!organization_id) {
    return res.status(400).json({ success: false, message: "organization_id is required" });
  }

  try {
    const check = await User.findOne({ mobile });

    if (check) {
      return res.json("exist");
    }

    const newUser = new User({
      name,
      password,
      mobile,
      type,
      user_uuid: uuid(),
      organization_id,
    });

    await newUser.save();
    res.json("notexist");

  } catch (e) {
    console.error("Error saving user:", e);
    res.status(500).json("fail");
  }
});

// 🧾 Get all users for one organization
router.get("/GetUserList/:organization_id", async (req, res) => {
  const { organization_id } = req.params;

  try {
    const users = await User.find({ organization_id });

    if (users.length)
      res.json({ success: true, result: users });
    else
      res.json({ success: false, message: "No users found" });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📄 Get single user by MongoDB ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, result: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
});

// ❌ Delete user
router.delete('/:id', async (req, res) => {
  try {
    const users = await User.findById(req.params.id);

    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✏️ Update user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, mobile, type, password } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { name, mobile, type, password },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User updated successfully', result: updatedUser });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
});

module.exports = router;
