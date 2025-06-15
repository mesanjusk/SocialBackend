const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timing: { type: String },
  organization_id: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
