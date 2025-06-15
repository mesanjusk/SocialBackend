const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const recordSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4 },

  // Record type: either 'enquiry' or 'admission'
  type: { type: String, enum: ['enquiry', 'admission'], required: true },

  // Required organization identifier
  organization_id: { type: String, required: true },

  // For tracking enquiry converted to admission
  convertedToAdmission: { type: Boolean, default: false },

  // Common fields
  branchCode: String,
  enquiryDate: Date,
  admissionDate: Date,
  firstName: String,
  middleName: String,
  lastName: String,
  dob: Date,
  gender: String,
  mobileSelf: String,
  mobileSelfWhatsapp: Boolean,
  mobileParent: String,
  mobileParentWhatsapp: Boolean,
  address: String,
  education: String,
  schoolName: String,
  referredBy: String,
  followUpDate: Date,
  remarks: String,
  course: String,
  batchTime: String,
  examEvent: String,
  installment: String,
  fees: Number,
  discount: Number,
  total: Number,
  feePaid: Number,
  paidBy: String,
  balance: Number,

  // Optional: Track who created the record
  createdBy: String
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
