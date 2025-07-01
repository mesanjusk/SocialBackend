const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const accountSchema = new mongoose.Schema({
  Account_uuid: { type: String, default: uuidv4, unique: true },
  institute_uuid: { type: String, required: true },
  Account_name: { type: String, required: true },
  Mobile_number: { type: String }, 
  Account_group: { type: String, required: true },
  Status: { type: String, default: 'active' },
}, { timestamps: true });

// Indexes for faster lookups
accountSchema.index({ uuid: 1 }, { unique: true });
accountSchema.index({ institute_uuid: 1 });

module.exports = mongoose.model('Account', accountSchema);
