const leadSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4, unique: true },
  institute_uuid: { type: String, required: true },
  student_uuid: { type: String, required: true },

  
  enquiryDate: { type: Date, default: Date.now },
  referredBy: String,

  course: { type: String },  // ✅ Add this line

  leadStatus: { type: String, enum: ['open', 'follow-up', 'converted', 'lost'], default: 'open' },
  followups: [followUpSchema],

  createdBy: String,
}, { timestamps: true });
