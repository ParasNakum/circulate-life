require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const donorRoutes = require('./routes/donor');
const recipientRoutes = require('./routes/recipient');
const BloodStorage = require('./models/BloodStorage');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/circulate_life';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/recipient', recipientRoutes);

// Public blood availability route
app.get('/api/blood/availability', async (req, res) => {
  try {
    const storage = await BloodStorage.find().sort({ blood_group: 1 });
    res.json(storage);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving blood stock', error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', project: 'Circulate Life Full-Stack API', timestamp: new Date() });
});

// MongoDB Connection & Auto-Seed
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('✅ Connected to MongoDB at ' + MONGO_URI);
    // Initialize blood groups if not created
    const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    for (const bg of groups) {
      const exists = await BloodStorage.findOne({ blood_group: bg });
      if (!exists) {
        await BloodStorage.create({ blood_group: bg, unit: 10 });
      }
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// Serve static frontend build if present (e.g. single-container live deployment)
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Circulate Life API running on http://localhost:${PORT}`);
});
