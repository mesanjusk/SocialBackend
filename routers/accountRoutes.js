const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Add a new account
router.post('/addAccount', accountController.addAccount);


// Get all accounts
router.get('/GetAccountList', accountController.getAccountList);

module.exports = router;
