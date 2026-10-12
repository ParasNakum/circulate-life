const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BloodRequest = require('../models/BloodRequest');
const { authenticate, authorize } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Protect all recipient routes
router.use(authenticate, authorize('recipient'));

// Recipient Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const requestCount = await BloodRequest.countDocuments({ email: req.user.email });
    const approvedCount = await BloodRequest.countDocuments({ email: req.user.email, status: 'Accepted' });
    const pendingCount = await BloodRequest.countDocuments({ email: req.user.email, status: 'Pending' });

    res.json({
      requestCount,
      approvedCount,
      pendingCount,
      user: req.user
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipient stats', error: err.message });
  }
});

// Request for Blood
router.post('/request-blood', upload.single('file_upload'), async (req, res) => {
  try {
    const {
      name,
      age,
      blood_group,
      reason_for_blood,
      when_required,
      unit,
      hospital_name,
      doctor_name,
      gender,
      address,
      pincode,
      contact
    } = req.body;

    const newRequest = new BloodRequest({
      userId: req.user._id,
      userRole: 'recipient',
      username: req.user.name,
      name: name || req.user.name,
      age: Number(age) || 30,
      blood_group,
      reason_for_blood,
      when_required,
      unit: Number(unit) || 1,
      hospital_name,
      doctor_name,
      gender: gender || '',
      address: address || req.user.address || '',
      pincode: pincode || req.user.pincode || '',
      contact: contact || req.user.contact || '',
      email: req.user.email,
      file_upload: req.file ? req.file.filename : ''
    });

    await newRequest.save();
    res.status(201).json({ message: 'Blood request submitted successfully!', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting blood request', error: err.message });
  }
});

// My Requests
router.get('/my-requests', async (req, res) => {
  try {
    const requests = await BloodRequest.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err.message });
  }
});

// Delete Blood Request
router.delete('/requests/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findOne({ _id: req.params.id, email: req.user.email });
    if (!request) {
      return res.status(404).json({ message: 'Request not found or unauthorized.' });
    }
    await BloodRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blood request deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blood request', error: err.message });
  }
});

module.exports = router;
