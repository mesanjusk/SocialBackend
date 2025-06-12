const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_uuid: String,
  name: String,
  mobile: { type: Number, unique: true },
  password: String,
  type: String
});

module.exports = mongoose.model('User', userSchema);
