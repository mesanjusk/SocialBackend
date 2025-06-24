const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

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

// ✅ Root path check
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    const host = req.headers.host;
    if (host && host.split('.').length > 2) {
      return res.send('🌐 Subdomain detected. Use frontend interface.');
    }
  }
  res.send('✅ API is running...');
});

// ✅ Public route to resolve subdomain
app.use('/api/resolve-org', require('./routers/resolveOrgRoute'));

// ✅ All API routes (without resolveOrganization middleware)
app.use('/api/auth', require('./routers/authRoutes'));
app.use('/api/organize', require('./routers/organize'));
app.use('/api/organization', require('./routers/organizationRoutes'));
app.use('/api/enquiry', require('./routers/enquiryRoutes'));
app.use('/api/courses', require('./routers/courseRoutes'));
app.use('/api/record', require('./routers/recordRoutes'));
app.use('/api/batches', require('./routers/batchRoutes'));
app.use('/api/org-categories', require('./routers/orgCategoryRoutes'));
app.use('/api/education', require('./routers/educationRoutes'));
app.use('/api/exams', require('./routers/examRoutes'));
app.use('/api/paymentmode', require('./routers/paymentModeRoutes'));

// ✅ Upload stays public
app.use('/api/upload', require('./uploadRoute'));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
