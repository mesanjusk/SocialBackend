const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routers/authRoutes');
const uploadRoute = require('./uploadRoute');
const organizeRoute = require('./routers/organization');
const enquiryRoute = require('./routers/enquiryRoutes');
const courseRoutes = require('./routers/courseRoutes');
const recordRoutes = require('./routers/recordRoutes');
const batchRoutes = require('./routers/batchRoutes');
const orgRoutes = require('./routers/organizationRoutes');
const orgCategoryRoutes = require('./routers/orgCategoryRoutes');
const educationRoutes = require('./routers/educationRoutes');
const examRoutes = require('./routers/examRoutes');

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Health check
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/organize', organizeRoute);
app.use('/api/organization', orgRoutes);
app.use('/api/enquiry', enquiryRoute);
app.use('/api/courses', courseRoutes);
app.use('/api/record', recordRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/org-categories', orgCategoryRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/exams', examRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
