const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const instituteSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  institute_title: {
    type: String,
    required: true
  },
  institute_type: {
    type: String,
    required: true
  },
  center_code: {
    type: String,
    required: true,
    unique: true
  },
  institute_call_number: {
    type: String,
    required: true,
    unique: true
  },
  center_head_name: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true
  },
  theme: {
    color: {
      type: String,
      default: '#10B981'
    },
    logo: {
      type: String,
      default: ''
    },
    favicon: {
      type: String,
      default: ''
    }
  },
  status: {
    type: String,
    enum: ['trial', 'active', 'expired'],
    default: 'trial'
  },
  plan_type: {
    type: String,
    enum: ['free', 'trial', 'paid'],
    default: 'trial'
  },
  whiteLabel: {
    type: Boolean,
    default: false
  },
  modulesEnabled: {
    type: [String],
    default: []
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  trialExpiresAt: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    }
  }
});

module.exports = mongoose.model('Institute', instituteSchema);
