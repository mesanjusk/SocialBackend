const mongoose = require('mongoose');

const whatsappIntegrationSchema = new mongoose.Schema(
  {
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'Institute',
    },
    connectionType: {
      type: String,
      enum: ['EMBEDDED', 'MANUAL'],
      required: true,
    },
    wabaId: { type: String, default: '' },
    phoneNumberId: { type: String, default: '' },
    businessId: { type: String, default: '' },
    displayName: { type: String, default: '' },
    accessToken: { type: String, required: true },
    status: {
      type: String,
      enum: ['connected', 'disconnected', 'expired'],
      default: 'disconnected',
    },
    webhookSubscribed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

whatsappIntegrationSchema.index({ centerId: 1, phoneNumberId: 1 }, { unique: true, sparse: true });

const whatsappMessageLogSchema = new mongoose.Schema(
  {
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'Institute',
    },
    integrationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'WhatsAppIntegration',
    },
    to: { type: String, default: '' },
    messageType: {
      type: String,
      enum: ['text', 'template', 'media'],
      default: 'text',
    },
    status: { type: String, default: 'queued' },
    metaMessageId: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

whatsappMessageLogSchema.index({ centerId: 1, timestamp: -1 });
whatsappMessageLogSchema.index({ integrationId: 1, metaMessageId: 1 });

const WhatsAppIntegration = mongoose.model('WhatsAppIntegration', whatsappIntegrationSchema);
const WhatsAppMessageLog = mongoose.model('WhatsAppMessageLog', whatsappMessageLogSchema);

module.exports = {
  WhatsAppIntegration,
  WhatsAppMessageLog,
};
