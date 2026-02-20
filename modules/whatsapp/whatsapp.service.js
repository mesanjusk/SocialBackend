const axios = require('axios');
const { WhatsAppIntegration, WhatsAppMessageLog } = require('./whatsapp.model');
const { decryptToken } = require('./token.util');

const GRAPH_BASE_URL = 'https://graph.facebook.com/v18.0';

async function getConnectedIntegration(centerId, integrationId) {
  const query = {
    centerId,
    status: 'connected',
  };

  if (integrationId) {
    query._id = integrationId;
  }

  const integration = await WhatsAppIntegration.findOne(query).sort({ updatedAt: -1 });

  if (!integration) {
    throw new Error('No connected WhatsApp integration found for center');
  }

  return integration;
}

async function verifyToken(accessToken) {
  const response = await axios.get(`${GRAPH_BASE_URL}/me`, {
    params: { access_token: accessToken },
  });

  return response.data;
}

async function sendTextMessage(centerId, to, message, integrationId) {
  const integration = await getConnectedIntegration(centerId, integrationId);
  const accessToken = decryptToken(integration.accessToken);

  const response = await axios.post(
    `${GRAPH_BASE_URL}/${integration.phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  await WhatsAppMessageLog.create({
    centerId,
    integrationId: integration._id,
    to,
    messageType: 'text',
    status: 'sent',
    metaMessageId: response.data?.messages?.[0]?.id || '',
    timestamp: new Date(),
  });

  return response.data;
}

async function sendTemplateMessage(centerId, to, templateName, params = [], integrationId) {
  const integration = await getConnectedIntegration(centerId, integrationId);
  const accessToken = decryptToken(integration.accessToken);

  const components = params.length
    ? [
        {
          type: 'body',
          parameters: params.map((value) => ({ type: 'text', text: String(value) })),
        },
      ]
    : [];

  const response = await axios.post(
    `${GRAPH_BASE_URL}/${integration.phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' },
        components,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  await WhatsAppMessageLog.create({
    centerId,
    integrationId: integration._id,
    to,
    messageType: 'template',
    status: 'sent',
    metaMessageId: response.data?.messages?.[0]?.id || '',
    timestamp: new Date(),
  });

  return response.data;
}

async function sendMediaMessage(centerId, to, mediaUrl, integrationId) {
  const integration = await getConnectedIntegration(centerId, integrationId);
  const accessToken = decryptToken(integration.accessToken);

  const response = await axios.post(
    `${GRAPH_BASE_URL}/${integration.phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: { link: mediaUrl },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  await WhatsAppMessageLog.create({
    centerId,
    integrationId: integration._id,
    to,
    messageType: 'media',
    status: 'sent',
    metaMessageId: response.data?.messages?.[0]?.id || '',
    timestamp: new Date(),
  });

  return response.data;
}

async function fetchTemplates(centerId, integrationId) {
  const integration = await getConnectedIntegration(centerId, integrationId);
  const accessToken = decryptToken(integration.accessToken);

  const response = await axios.get(`${GRAPH_BASE_URL}/${integration.wabaId}/message_templates`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}

module.exports = {
  verifyToken,
  sendTextMessage,
  sendTemplateMessage,
  sendMediaMessage,
  fetchTemplates,
  getConnectedIntegration,
};
