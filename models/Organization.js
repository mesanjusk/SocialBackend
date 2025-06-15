const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const org_whatsapp_numberSchema = new mongoose.Schema({
  message: { type: String, required: true },
  tag: { type: String, required: true },
  mobile: { type: Number, required: true }
}, { _id: false });

const org_call_numberSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  mobile: { type: Number, required: true }
}, { _id: false });

const organizationSchema = new mongoose.Schema({
  organization_uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  center_code: {
    type: String,
    required: true,
    unique: true
  },
  organization_title: {
    type: String,
    required: true
  },
  organization_whatsapp_number: {
    type: Number,
    unique: true
  },
  organization_call_number: {
    type: Number,
    unique: true
  },
  organization_whatsapp_message: String,
  login_username: {
    type: String,
    required: true,
    unique: true
  },
  login_password: {
    type: String,
    required: true
  },
  organization_logo: String,
  theme_color: String,
  plan_type: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },
  created_by: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  domains: [String],
  org_whatsapp_number: [org_whatsapp_numberSchema],
  org_call_number: [org_call_numberSchema]
});

module.exports = mongoose.model('Organization', organizationSchema);
