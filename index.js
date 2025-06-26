const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const otpRoutes = require('./routers/otpRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ✅ Root path check (subdomain-aware message)
app.get('/', (req, res) => {
  const host = req.headers.host || '';
  const baseDomains = ['onrender.com', 'render.com'];

  const isSubdomain = baseDomains.some(base =>
    host.endsWith(base) && host.split('.').length > base.split('.').length + 1
  );

  if (isSubdomain) {
    res.send('🌐 Subdomain detected. Use frontend interface.');
  } else {
    res.send('✅ API is running...');
  }
});

app.use('/api', otpRoutes);
app.use('/api/institute', require('./routers/instituteRoutes'));
app.use('/api/auth', require('./routers/authRoutes'));
app.use('/api/enquiry', require('./routers/enquiryRoutes'));
app.use('/api/courses', require('./routers/courseRoutes'));
app.use('/api/record', require('./routers/recordRoutes'));
app.use('/api/batches', require('./routers/batchRoutes'));
app.use('/api/org-categories', require('./routers/orgCategoryRoutes'));
app.use('/api/education', require('./routers/educationRoutes'));
app.use('/api/exams', require('./routers/examRoutes'));
app.use('/api/paymentmode', require('./routers/paymentModeRoutes'));

// ✅ Upload route
app.use('/api/upload', require('./uploadRoute'));
app.use('/api/branding', require('./routers/brandingRoutes'));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
