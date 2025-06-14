const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  branchCode: String,
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
  batchTime: String,
  examEvent: String,
  course: String,
  installment: String,
  fees: Number,
  discount: Number,
  total: Number,
  feePaid: Number,
  paidBy: String,
  balance: Number,
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);
