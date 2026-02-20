const express = require('express');
const jwt = require('jsonwebtoken');
const whatsappController = require('./whatsapp.controller');
const webhookController = require('./webhook.controller');

const router = express.Router();

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

router.get('/webhook', webhookController.verifyWebhook);
router.post('/webhook', webhookController.processWebhook);

router.get('/integrations/:centerId', requireAuth, whatsappController.getIntegrationsByCenter);
router.post('/manual/connect', requireAuth, whatsappController.manualConnect);
router.post('/embedded/exchange', requireAuth, whatsappController.embeddedExchange);
router.post('/embedded/callback', requireAuth, whatsappController.embeddedCallback);
router.delete('/integrations/:id', requireAuth, whatsappController.disconnectIntegration);
router.post('/messages/text', requireAuth, whatsappController.sendText);
router.post('/messages/template', requireAuth, whatsappController.sendTemplate);
router.post('/messages/media', requireAuth, whatsappController.sendMedia);
router.get('/templates/:integrationId', requireAuth, whatsappController.getTemplates);

module.exports = router;
