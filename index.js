const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const metadataRoute = require('./routes/metadataRoute');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ✅ Subdomain-aware root route
app.get('/', (req, res) => {
  const host = req.headers.host || '';
  const baseDomains = ['onrender.com', 'render.com'];
  const isSubdomain = baseDomains.some(base =>
    host.endsWith(base) && host.split('.').length > base.split('.').length + 1
  );
  res.send(isSubdomain
    ? '🌐 Subdomain detected. Use frontend interface.'
    : '✅ API is running...');
});

// ✅ Routes
app.use('/api', require('./routers/otpRoutes'));
app.use('/api/institute', require('./routers/instituteRoutes'));
app.use('/api/auth', require('./routers/authRoutes'));
app.use('/api/enquiry', require('./routers/enquiryRoutes'));
app.use('/api/courses', require('./routers/courseRoutes'));
app.use('/api/courseCategory', require('./routers/courseCategoryRoutes'));
app.use('/api/record', require('./routers/recordRoutes'));
app.use('/api/batches', require('./routers/batchRoutes'));
app.use('/api/org-categories', require('./routers/orgCategoryRoutes'));
app.use('/api/education', require('./routers/educationRoutes'));
app.use('/api/exams', require('./routers/examRoutes'));
app.use('/api/paymentmode', require('./routers/paymentModeRoutes'));
app.use('/api/upload', require('./uploadRoute'));
app.use('/api/branding', require('./routers/brandingRoutes'));
app.use('/api/metadata', metadataRoute);


// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Optional global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
