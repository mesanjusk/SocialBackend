const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routers/authRoutes');
const uploadRoute = require('./uploadRoute');
const organizeRoute = require('./routers/organization'); // organization create
const enquiryRoute = require('./routers/enquiryRoutes');
const courseRoutes = require('./routers/courseRoutes');
const recordRoutes = require('./routers/recordRoutes');
const batchRoutes = require('./routers/batchRoutes');
const orgRoutes = require('./routers/organizationRoutes'); // login & fetch organization

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json()); // Handle JSON payloads

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Health check route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/organize', organizeRoute);          // Add/Signup organization
app.use('/api/organization', orgRoutes);          // Login/check organization
app.use('/api/enquiry', enquiryRoute);
app.use('/api/courses', courseRoutes);
app.use('/api/record', recordRoutes);             // Admissions & converted enquiries
app.use('/api/batches', batchRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
