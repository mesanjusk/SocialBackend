const axios = require('axios');
const mongoose = require('mongoose');
const Institute = require('../../models/institute');
const { WhatsAppIntegration } = require('./whatsapp.model');
const whatsappService = require('./whatsapp.service');
const { encryptToken } = require('./token.util');

const GRAPH_BASE_URL = 'https://graph.facebook.com/v18.0';

class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function handleControllerError(res, error) {
  const status = error.statusCode || error.response?.status || 500;
  const message = error.response?.data?.error?.message || error.message || 'Unexpected error';
  return res.status(status).json({ success: false, message });
}

function validateCenterId(centerId) {
  if (!centerId || !mongoose.Types.ObjectId.isValid(centerId)) {
    throw new HttpError('Invalid centerId', 400);
  }
}

async function ensureCenterAccess(centerId, user) {
  validateCenterId(centerId);

  const institute = await Institute.findById(centerId).lean();
  if (!institute) {
    throw new HttpError('Center not found', 404);
  }

  if (user?.role !== 'superadmin' && user?.institute_uuid !== institute.institute_uuid) {
    throw new HttpError('Forbidden center access', 403);
  }

  return institute;
}

function ensureMetaEnvForEmbedded() {
  if (!process.env.META_APP_ID || !process.env.META_APP_SECRET) {
    throw new HttpError('META_APP_ID and META_APP_SECRET are required', 500);
  }
}

async function getIntegrationsByCenter(req, res) {
  try {
    const { centerId } = req.params;
    await ensureCenterAccess(centerId, req.user);

    const integrations = await WhatsAppIntegration.find({ centerId }).sort({ updatedAt: -1 }).lean();
    const sanitized = integrations.map(({ accessToken, ...rest }) => rest);

    return res.status(200).json({ success: true, data: sanitized });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

async function manualConnect(req, res) {
  try {
    const { centerId, accessToken, phoneNumberId, wabaId, businessId } = req.body;

    if (!centerId || !accessToken || !phoneNumberId || !wabaId) {
      return res.status(400).json({ success: false, message: 'centerId, accessToken, phoneNumberId and wabaId are required' });
    }

    await ensureCenterAccess(centerId, req.user);

    await whatsappService.verifyToken(accessToken);
    const phoneRes = await axios.get(`${GRAPH_BASE_URL}/${phoneNumberId}`, {
      params: { access_token: accessToken, fields: 'id,display_phone_number,verified_name' },
    });

    const metaDisplayName = phoneRes.data?.verified_name || phoneRes.data?.display_phone_number || '';

    const integration = await WhatsAppIntegration.findOneAndUpdate(
      { centerId, phoneNumberId },
      {
        centerId,
        connectionType: 'MANUAL',
        accessToken: encryptToken(accessToken),
        phoneNumberId,
        wabaId,
        displayName: metaDisplayName,
        businessId: businessId || '',
        status: 'connected',
        webhookSubscribed: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, message: 'WhatsApp connected successfully', integrationId: integration._id });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

async function embeddedExchange(req, res) {
  try {
    const { centerId, code } = req.body;
    if (!centerId || !code) {
      return res.status(400).json({ success: false, message: 'centerId and code are required' });
    }

    ensureMetaEnvForEmbedded();
    await ensureCenterAccess(centerId, req.user);

    const tokenRes = await axios.get(`${GRAPH_BASE_URL}/oauth/access_token`, {
      params: {
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        code,
      },
    });

    const shortToken = tokenRes.data.access_token;
    const longLivedRes = await axios.get(`${GRAPH_BASE_URL}/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: shortToken,
      },
    });

    const accessToken = longLivedRes.data.access_token;
    const businessesRes = await axios.get(`${GRAPH_BASE_URL}/me/businesses`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const business = businessesRes.data?.data?.[0] || {};
    const ownedWabaRes = await axios.get(`${GRAPH_BASE_URL}/${business.id}/owned_whatsapp_business_accounts`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const waba = ownedWabaRes.data?.data?.[0] || {};
    const phoneRes = await axios.get(`${GRAPH_BASE_URL}/${waba.id}/phone_numbers`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const phone = phoneRes.data?.data?.[0] || {};

    if (!business.id || !waba.id || !phone.id) {
      return res.status(400).json({ success: false, message: 'Unable to fetch business/WABA/phone metadata from Meta' });
    }

    const integration = await WhatsAppIntegration.findOneAndUpdate(
      { centerId, phoneNumberId: phone.id },
      {
        centerId,
        connectionType: 'EMBEDDED',
        accessToken: encryptToken(accessToken),
        phoneNumberId: phone.id,
        wabaId: waba.id,
        businessId: business.id,
        displayName: phone.verified_name || phone.display_phone_number || '',
        status: 'connected',
        webhookSubscribed: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, message: 'Embedded signup connected', integrationId: integration._id });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

async function embeddedCallback(req, res) {
  try {
    const { centerId, accessToken, phoneNumberId, wabaId, businessId, displayName } = req.body;

    if (!centerId || !accessToken || !phoneNumberId || !wabaId) {
      return res.status(400).json({ success: false, message: 'centerId, accessToken, phoneNumberId and wabaId are required' });
    }

    await ensureCenterAccess(centerId, req.user);
    await whatsappService.verifyToken(accessToken);

    const integration = await WhatsAppIntegration.findOneAndUpdate(
      { centerId, phoneNumberId },
      {
        centerId,
        connectionType: 'EMBEDDED',
        accessToken: encryptToken(accessToken),
        phoneNumberId,
        wabaId,
        businessId: businessId || '',
        displayName: displayName || '',
        status: 'connected',
        webhookSubscribed: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, message: 'Embedded callback processed', integrationId: integration._id });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

async function disconnectIntegration(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid integration id' });
    }

    const integration = await WhatsAppIntegration.findById(id);
    if (!integration) {
      return res.status(404).json({ success: false, message: 'Integration not found' });
    }

    await ensureCenterAccess(String(integration.centerId), req.user);

    integration.status = 'disconnected';
    integration.webhookSubscribed = false;
    await integration.save();

    return res.status(200).json({ success: true, message: 'Integration disconnected' });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

async function sendText(req, res) {
  try {
    const { centerId, to, message, integrationId } = req.body;
    if (!centerId || !to || !message) {
      return res.status(400).json({ success: false, message: 'centerId, to and message are required' });
    }

    await ensureCenterAccess(centerId, req.user);

    const data = await whatsappService.sendTextMessage(centerId, to, message, integrationId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

async function sendTemplate(req, res) {
  try {
    const { centerId, to, templateName, params, integrationId } = req.body;
    if (!centerId || !to || !templateName) {
      return res.status(400).json({ success: false, message: 'centerId, to and templateName are required' });
    }

    await ensureCenterAccess(centerId, req.user);

    const data = await whatsappService.sendTemplateMessage(centerId, to, templateName, params, integrationId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

async function sendMedia(req, res) {
  try {
    const { centerId, to, mediaUrl, integrationId } = req.body;
    if (!centerId || !to || !mediaUrl) {
      return res.status(400).json({ success: false, message: 'centerId, to and mediaUrl are required' });
    }

    await ensureCenterAccess(centerId, req.user);

    const data = await whatsappService.sendMediaMessage(centerId, to, mediaUrl, integrationId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

async function getTemplates(req, res) {
  try {
    const { integrationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(integrationId)) {
      return res.status(400).json({ success: false, message: 'Invalid integration id' });
    }

    const integration = await WhatsAppIntegration.findById(integrationId);
    if (!integration) {
      return res.status(404).json({ success: false, message: 'Integration not found' });
    }

    await ensureCenterAccess(String(integration.centerId), req.user);

    const data = await whatsappService.fetchTemplates(integration.centerId, integrationId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

module.exports = {
  getIntegrationsByCenter,
  manualConnect,
  embeddedExchange,
  embeddedCallback,
  disconnectIntegration,
  sendText,
  sendTemplate,
  sendMedia,
  getTemplates,
  ensureCenterAccess,
};
