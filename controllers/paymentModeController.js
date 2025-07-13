const PaymentMode = require('../models/PaymentMode');

exports.getPaymentModes = async (req, res) => {
  try {
    const data = await PaymentMode.find().lean();
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Failed to fetch payment modes:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPaymentModeByUuid = async (req, res) => {
  try {
    const entry = await PaymentMode.findOne({ uuid: req.params.uuid }).lean();
    if (!entry) return res.status(404).json({ error: 'Payment mode not found' });
    res.status(200).json(entry);
  } catch (err) {
    console.error('❌ Failed to fetch by UUID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createPaymentMode = async (req, res) => {
  try {
    const { mode, description } = req.body;
    if (!mode) return res.status(400).json({ error: 'Mode is required' });

    const newEntry = new PaymentMode({ mode, description });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('❌ Failed to create payment mode:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePaymentMode = async (req, res) => {
  try {
    const updated = await PaymentMode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Payment mode not found' });
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Failed to update payment mode:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deletePaymentMode = async (req, res) => {
  try {
    const deleted = await PaymentMode.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Payment mode not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error('❌ Failed to delete payment mode:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
