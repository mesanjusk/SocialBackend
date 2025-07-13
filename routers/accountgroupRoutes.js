const express = require('express');
const router = express.Router();
const accountgroupController = require('../controllers/accountgroupController');

router.post('/addAccountgroup', accountgroupController.addAccountgroup);

router.get('/GetAccountgroupList', accountgroupController.getAccountgroupList);

module.exports = router;
