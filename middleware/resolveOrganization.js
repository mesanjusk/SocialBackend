// middleware/resolveOrganization.js
const Organization = require('../models/Organization');

function getSubdomain(req) {
  const host = req.headers.host; // e.g., abc.mysaas.com:3000
  return host.split('.')[0]; // abc
}

async function resolveOrganization(req, res, next) {
  const subdomain = getSubdomain(req);
  const fullDomain = `${subdomain}.mysaas.com`;

  try {
    const org = await Organization.findOne({ domains: fullDomain });
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    req.organization = org;
    next();
  } catch (err) {
    console.error('Error resolving organization:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = resolveOrganization;
