// middleware/resolveinstitute.js
const institute = require('../models/institute');

function getSubdomain(req) {
  const host = req.headers.host; // e.g., abc.mysaas.com:3000
  return host.split('.')[0]; // abc
}

async function resolveinstitute(req, res, next) {
  const subdomain = getSubdomain(req);
  const fullDomain = `${subdomain}.mysaas.com`;

  try {
    const org = await institute.findOne({ domains: fullDomain });
    if (!org) return res.status(404).json({ error: 'institute not found' });

    req.institute = org;
    next();
  } catch (err) {
    console.error('Error resolving institute:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = resolveinstitute;
