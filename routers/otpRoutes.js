// routes/otpRoutes.js
const express = require('express');
const router = express.Router();

const otpStore = {}; 

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}

router.post('/send-otp', (req, res) => {
  const { mobile } = req.body;

  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ success: false, message: 'Invalid mobile number' });
  }

  const otp = generateOTP();
  otpStore[mobile] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; 

  console.log(`OTP for ${mobile} is ${otp}`);

  res.json({ success: true, otp });
});

router.post('/verify-otp', (req, res) => {
  const { mobile, otp } = req.body;
  const record = otpStore[mobile];

  if (!record) {
    return res.status(400).json({ success: false, message: 'OTP not sent to this number' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[mobile];
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  delete otpStore[mobile]; // OTP used successfully
  res.json({ success: true, message: 'OTP verified' });
});

module.exports = router;
