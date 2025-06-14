const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  type: { type: String, enum: ['enquiry', 'admission'], required: true },
  branchCode: String,
  enquiryDate: Date,
  admissionDate: Date,

  // Personal Info
  firstName: String,
  middleName: String,
  lastName: String,
  dob: Date,
  gender: String,

  // Contact Info
  mobileSelf: String,
  mobileSelfWhatsapp: Boolean,
  mobileParent: String,
  mobileParentWhatsapp: Boolean,
  address: String,

  // Academic Info
  education: String,
  schoolName: String,
  course: String,
  batchTime: String,
  examEvent: String,

  // Source Info
  referredBy: String,
  followUpDate: Date,
  remarks: String,

  // Payment Info (only for admission)
  installment: String,
  fees: Number,
  discount: Number,
  total: Number,
  feePaid: Number,
  paidBy: String,
  balance: Number,
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
