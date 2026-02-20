const { WhatsAppIntegration, WhatsAppMessageLog } = require('./whatsapp.model');

async function onIncomingMessage({ centerId, integrationId, messagePayload }) {
  return { centerId, integrationId, messagePayload };
}

async function verifyWebhook(req, res) {
  if (!process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return res.status(500).json({ success: false, message: 'META_WEBHOOK_VERIFY_TOKEN is not configured' });
  }

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ success: false, message: 'Webhook verification failed' });
}

async function processWebhook(req, res) {
  try {
    const entries = req.body?.entry || [];

    for (const entry of entries) {
      const changes = entry?.changes || [];

      for (const change of changes) {
        const value = change?.value || {};
        const phoneNumberId = value?.metadata?.phone_number_id;
        if (!phoneNumberId) continue;

        const integration = await WhatsAppIntegration.findOne({ phoneNumberId, status: 'connected' });
        if (!integration) continue;

        const messages = value?.messages || [];
        for (const msg of messages) {
          const normalizedType = msg.type === 'image' || msg.type === 'video' || msg.type === 'document' ? 'media' : msg.type || 'text';

          await WhatsAppMessageLog.findOneAndUpdate(
            { integrationId: integration._id, metaMessageId: msg.id || `${msg.from}-${msg.timestamp}`, status: 'incoming' },
            {
              centerId: integration.centerId,
              integrationId: integration._id,
              to: msg.from || '',
              messageType: normalizedType,
              status: 'incoming',
              metaMessageId: msg.id || '',
              timestamp: msg.timestamp ? new Date(Number(msg.timestamp) * 1000) : new Date(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          await onIncomingMessage({
            centerId: integration.centerId,
            integrationId: integration._id,
            messagePayload: msg,
          });
        }

        const statuses = value?.statuses || [];
        for (const statusEvent of statuses) {
          await WhatsAppMessageLog.findOneAndUpdate(
            { integrationId: integration._id, metaMessageId: statusEvent.id || '', status: statusEvent.status || 'sent' },
            {
              centerId: integration.centerId,
              integrationId: integration._id,
              to: statusEvent.recipient_id || '',
              messageType: 'text',
              status: statusEvent.status || 'sent',
              metaMessageId: statusEvent.id || '',
              timestamp: statusEvent.timestamp ? new Date(Number(statusEvent.timestamp) * 1000) : new Date(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  verifyWebhook,
  processWebhook,
  onIncomingMessage,
};
