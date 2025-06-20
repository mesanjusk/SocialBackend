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

// ✅ Subdomain middleware + route
const resolveOrganization = require('./middleware/resolveOrganization');
const resolveOrgRoute = require('./routers/resolveOrgRoute');

// ✅ Root path check
app.get('/', (req, res) => {
  const host = req.headers.host;
  if (!host || host.split('.').length < 3) {
    res.send('✅ API is running on root domain...');
  } else {
    res.send('🌐 Subdomain detected. Use frontend interface.');
  }
});

// ✅ Public route to resolve subdomain
app.use('/api/resolve-org', resolveOrgRoute);

// ✅ Allow login routes on root domain
app.use('/api/auth', require('./routers/authRoutes')); // ⬅️ no middleware here

// ✅ All others are protected with subdomain
app.use('/api/organize', resolveOrganization, require('./routers/organize'));
app.use('/api/organization', resolveOrganization, require('./routers/organizationRoutes'));
app.use('/api/enquiry', resolveOrganization, require('./routers/enquiryRoutes'));
app.use('/api/courses', resolveOrganization, require('./routers/courseRoutes'));
app.use('/api/record', resolveOrganization, require('./routers/recordRoutes'));
app.use('/api/batches', resolveOrganization, require('./routers/batchRoutes'));
app.use('/api/org-categories', resolveOrganization, require('./routers/orgCategoryRoutes'));
app.use('/api/education', resolveOrganization, require('./routers/educationRoutes'));
app.use('/api/exams', resolveOrganization, require('./routers/examRoutes'));
app.use('/api/paymentmode', resolveOrganization, require('./routers/paymentModeRoutes'));

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
