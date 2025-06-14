const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  type: { type: String, enum: ['enquiry', 'admission'], required: true }, // key field
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

  // Admission-only fields
  batchTime: String,
  examEvent: String,
  installment: String,
  fees: Number,
  discount: Number,
  total: Number,
  feePaid: Number,
  paidBy: String,
  balance: Number,
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
