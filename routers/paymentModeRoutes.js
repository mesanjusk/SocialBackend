const express = require('express');
const router = express.Router();
const paymentModeController = require('../controllers/paymentModeController');

// GET all
router.get('/', paymentModeController.getPaymentModes);

// GET by UUID
router.get('/uuid/:uuid', paymentModeController.getPaymentModeByUuid);

// POST new
router.post('/', paymentModeController.createPaymentMode);

// PUT update
router.put('/:id', paymentModeController.updatePaymentMode);

// DELETE
router.delete('/:id', paymentModeController.deletePaymentMode);

module.exports = router;
