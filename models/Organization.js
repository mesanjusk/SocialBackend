const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const organizationSchema = new mongoose.Schema({
  organization_uuid: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  center_code: {
    type: String,
    required: true,
    unique: true,
  },
  organization_title: {
    type: String,
    required: true,
  },
  organization_type: {
    type: String,
    required: true,
  },
  organization_call_number: {
    type: Number,
    required: true,
    unique: true,
  },
  mobile_number: {
    type: String,
    required: false, // optional; user-level login uses this
  },
  organization_logo: {
    type: String,
    default: '',
  },
  theme_color: {
    type: String,
    default: '#10B981',
  },
  plan_type: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  created_by: {
    type: String,
    default: 'system',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  domains: {
    type: [String],
    default: [],
  }
});

module.exports = mongoose.model('Organization', organizationSchema);
