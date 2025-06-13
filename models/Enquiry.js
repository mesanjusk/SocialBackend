import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  branchCode: String,
  enquiryDate: Date,
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
}, { timestamps: true });

export default mongoose.model('Enquiry', enquirySchema);
