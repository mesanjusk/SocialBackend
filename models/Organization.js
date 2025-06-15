// /models/Organization.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const organizationSchema = new mongoose.Schema({
  organization_uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  center_code: {
    type: String,
    unique: true,
    required: true
  },
  organization_title: String,
  organization_whatsapp_number: { type: Number, unique: true },
  organization_call_number: { type: Number, unique: true },
  organization_whatsapp_message: String,
  login_username: String,
  login_password: String,
  organization_logo: String,
  theme_color: String,
  domains: [String],
  plan_type: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },
  created_by: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  org_whatsapp_number: {
    tag: String,
    mobile: Number
  },
  org_call_number: {
    tag: String,
    mobile: Number
  }
});

module.exports = mongoose.model('Organization', organizationSchema);
