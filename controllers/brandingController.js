const Institute = require('../models/institute');

exports.getBranding = async (req, res) => {
  try {
    const instituteId = req.query.i || 'default';

    const institute = await Institute.findOne({
      $or: [
        { institute_uuid: instituteId },
        { 'access.subdomain': instituteId },
        { center_code: instituteId }
      ]
    });

    if (!institute) {
      return res.status(200).json({
        institute: 'Instify',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        theme: { color: '6fa8dc' }
      });
    }

    const branding = {
      institute: institute.institute_title,
      logo: institute.theme?.logo || '/logo.png',
      favicon: institute.theme?.favicon || '/favicon.ico',
      theme: {
        color: institute.theme?.color || '6fa8dc'
      }
    };

    return res.json(branding);
  } catch (err) {
    console.error('❌ Branding fetch error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

