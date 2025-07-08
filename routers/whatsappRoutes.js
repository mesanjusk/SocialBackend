const express = require('express');
const router = express.Router();
const { sendMessage } = require('../whatsapp/baileysClient');

router.post('/send', async (req, res) => {
  const { jid, text } = req.body;
  if(!jid || !text) {
    return res.status(400).json({ success: false, message: 'jid and text are required' });
  }
  try {
    await sendMessage(jid, text);
    res.json({ success: true });
  } catch (err) {
    console.error('WhatsApp send error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
