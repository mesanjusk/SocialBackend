const express = require('express');
const router = express.Router();

const Course = require('../models/Course');
const Education = require('../models/Education');
const Exam = require('../models/Exam');
const Batch = require('../models/Batch');
const PaymentMode = require('../models/PaymentMode');

// ✅ GET /api/metadata/:institute_uuid
router.get('/:institute_uuid', async (req, res) => {
    try {
        const { institute_uuid } = req.params;

        // Fetching collections; adjust filters if needed:
        const courses = await Course.find({ institute_uuid }).sort({ name: 1 });
        const educations = await Education.find({}).sort({ education: 1 }); // Global, adjust if needed
        const exams = await Exam.find({ institute_uuid }).sort({ exam: 1 });
        const batches = await Batch.find({ institute_uuid }).sort({ createdAt: -1 });
        const paymentModes = await PaymentMode.find({ institute_uuid }).sort({ createdAt: -1 });

        res.json({
            courses,
            educations,
            exams,
            batches,
            paymentModes,
        });
    } catch (err) {
        console.error("Metadata fetch failed:", err);
        res.status(500).json({ error: "Server error while fetching metadata" });
    }
});

module.exports = router;
