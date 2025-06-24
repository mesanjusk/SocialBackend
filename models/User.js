const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  user_uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    sparse: true  // Optional for flexibility if some users use mobile login
  },

  mobile: {
    type: String,
    unique: true,
    sparse: true
  },

  login_username: {
    type: String,
    required: true,
    unique: true
  },

  login_password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['superadmin', 'owner', 'admin', 'staff', 'student', 'parent'],
    default: 'admin'
  },

  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },

  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute'
  },

  isTrial: {
    type: Boolean,
    default: false
  },

  trialExpiresAt: {
    type: Date
  },

  theme: {
    primaryColor: { type: String },
    logoUrl: { type: String }
  },

  last_login_at: {
    type: Date,
    default: null
  },

  last_activity_at: {
    type: Date,
    default: null
  },

  last_password_change: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true }); // Adds createdAt, updatedAt

module.exports = mongoose.model('User', userSchema);
