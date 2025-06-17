const mongoose = require('mongoose');

const paymentModeSchema = new mongoose.Schema({
  mode: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentMode', paymentModeSchema);
