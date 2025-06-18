const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  user_uuid: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  name: String,
  mobile: {
    type: Number,
    unique: true,
  },
  login_username: {
    type: String,
    required: true,
    unique: true,
  },
  login_password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['admin', 'staff', 'owner'],
    default: 'admin',
  },
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  last_login_at: {
    type: Date,
    default: null,
  },
  last_activity_at: {
    type: Date,
    default: null,
  },
  last_password_change: {                         // ✅ Add this field
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
