// routers/resolveOrgRoute.js
const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');

router.get('/', async (req, res) => {
  const { subdomain } = req.query;
  if (!subdomain) return res.status(400).json({ error: 'Missing subdomain' });

  const fullDomain = `${subdomain}.mysaas.com`;

  try {
    const org = await Organization.findOne({ domains: fullDomain });
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    res.json({ success: true, organization: org });
  } catch (err) {
    console.error('Error in /api/resolve-org:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
