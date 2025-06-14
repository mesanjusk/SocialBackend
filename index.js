const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routers/authRoutes');
const uploadRoute = require('./uploadRoute');
const organizeRoute = require('./routers/organization');
const enquiryRoute = require('./routers/enquiryRoutes')
const courseRoutes = require('./routers/courseRoutes');
const admissionRoutes = require('./routers/admissionRoutes');
const batchRoutes = require('./routers/batchRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('Social Media Post Generator API Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/organize', organizeRoute);
app.use('/api/enquiry', enquiryRoute)
app.use('/api/courses', courseRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/batches', batchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
