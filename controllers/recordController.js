const Record = require('../models/Record'); // adjust path if needed

/**
 * Shared controller to fetch records by type (enquiry, admission, followup).
 * Supports pagination, sorting, and uses .lean() for low-memory reads.
 */
exports.getRecordsByType = async (req, res) => {
  try {
    const type = req.params.type; // "enquiry", "admission", "followup"
    const institute_uuid = req.query.institute_uuid || req.body.institute_uuid;

    if (!institute_uuid) {
      return res.status(400).json({ error: "Missing institute_uuid" });
    }

    const page = parseInt(req.query.page) || 0;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // max 100 to prevent heavy reads

    const filter = { type, institute_uuid };

    const records = await Record.find(filter)
      .sort({ enquiryDate: -1, admissionDate: -1, createdAt: -1 }) // auto sort by latest
      .skip(page * limit)
      .limit(limit)
      .lean(); // cost-efficient reads

    const total = await Record.countDocuments(filter);

    res.json({
      data: records,
      total,
      page,
      limit
    });

  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ error: "Server error" });
  }
};
