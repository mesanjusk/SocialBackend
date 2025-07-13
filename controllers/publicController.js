exports.getBranding = (req, res) => {
  res.json({
    institute: req.institute?.institute_title || null,
    theme: req.theme,
    favicon: req.theme?.favicon || '',
    logo: req.theme?.logo || '',
    color: req.theme?.color || '6fa8dc'
  });
};
