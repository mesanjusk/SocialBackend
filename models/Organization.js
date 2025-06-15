// models/Organization.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orgWhatsappNumberSchema = new mongoose.Schema({
  message: { type: String, required: true },
  tag: { type: String, required: true },
  mobile: { type: Number, required: true },
});

const orgCallNumberSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  mobile: { type: Number, required: true },
});

const organizationSchema = new mongoose.Schema({
  organization_uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  center_code: {
    type: String,
    required: true,
    unique: true,
  },
  organization_title: String,
  organization_type: String,
  organization_whatsapp_number: { type: Number, unique: true, sparse: true },
  organization_call_number: { type: Number, unique: true },
  organization_whatsapp_message: String,
  login_password: String,
  login_username: String,
  organization_logo: String,
  theme_color: String,
  plan_type: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  created_by: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  domains: [String],
  org_whatsapp_number: [orgWhatsappNumberSchema],
  org_call_number: [orgCallNumberSchema],
});

module.exports = mongoose.model('Organization', organizationSchema);
