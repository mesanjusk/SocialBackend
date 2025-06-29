const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const followUpSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ['open', 'follow-up', 'converted', 'lost'], required: true },
  remark: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const leadSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4, unique: true },
  institute_uuid: { type: String, required: true },
  student_uuid: { type: String, required: true },

  branchCode: String,
  enquiryDate: { type: Date, default: Date.now },
  referredBy: String,

  leadStatus: { type: String, enum: ['open', 'follow-up', 'converted', 'lost'], default: 'open' },
  followups: [followUpSchema],

  createdBy: String,
}, { timestamps: true });

// Indexes for efficient reporting
leadSchema.index({ uuid: 1 }, { unique: true });
leadSchema.index({ institute_uuid: 1 });
leadSchema.index({ student_uuid: 1 });
leadSchema.index({ leadStatus: 1 });

module.exports = mongoose.model('Lead', leadSchema);
