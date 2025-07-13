const express = require("express");
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/addTransaction', transactionController.addTransaction);

router.get('/GetTransactionList', transactionController.getTransactionList);

module.exports = router;
