// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_uuid: String,
  name: String,
  mobile: { type: Number, unique: true },
  password: String,
  type: String,
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
