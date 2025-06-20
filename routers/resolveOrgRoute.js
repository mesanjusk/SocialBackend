const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');

// ✅ Resolve by subdomain (e.g., abc.mysaas.com)
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

// ✅ Resolve by full host/domain (e.g., example.xyz.com)
router.get('/by-domain', async (req, res) => {
  const { host } = req.query;
  if (!host) return res.status(400).json({ error: 'Missing host' });

  try {
    const org = await Organization.findOne({ domains: host.toLowerCase() });
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    res.json({ success: true, organization: org });
  } catch (err) {
    console.error('Error in /api/resolve-org/by-domain:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
