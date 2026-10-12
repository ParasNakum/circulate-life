const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BloodRequest = require('../models/BloodRequest');
const Appointment = require('../models/Appointment');
const BloodDonation = require('../models/BloodDonation');
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

// Protect all donor routes
router.use(authenticate, authorize('donor'));

// Donor Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const requestCount = await BloodRequest.countDocuments({ email: req.user.email });
    const appointmentCount = await Appointment.countDocuments({ email: req.user.email });
    const donationCount = await BloodDonation.countDocuments({
      email: req.user.email,
      blood_status: { $in: ['active', 'stored'] }
    });

    res.json({
      requestCount,
      appointmentCount,
      donationCount,
      user: req.user
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching donor stats', error: err.message });
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
      userRole: 'donor',
      username: req.user.name,
      name: name || req.user.name,
      age: Number(age) || req.user.age || 25,
      blood_group: blood_group || req.user.blood_group,
      reason_for_blood,
      when_required,
      unit: Number(unit) || 1,
      hospital_name,
      doctor_name,
      gender: gender || req.user.gender,
      address: address || req.user.address,
      pincode: pincode || req.user.pincode,
      contact: contact || req.user.contact,
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
    res.json({ message: 'Blood request removed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing blood request', error: err.message });
  }
});

// Book Appointment
router.post('/appointment', async (req, res) => {
  try {
    const { blood_group, date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required for booking.' });
    }

    const newAppointment = new Appointment({
      userId: req.user._id,
      blood_group: blood_group || req.user.blood_group || 'O+',
      email: req.user.email,
      date,
      time,
      status: 'Pending'
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ message: 'Error booking appointment', error: err.message });
  }
});

// My Appointments
router.get('/my-appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
});

// Delete Appointment
router.delete('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, email: req.user.email });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized.' });
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling appointment', error: err.message });
  }
});

// Donation History
router.get('/donation-history', async (req, res) => {
  try {
    const donations = await BloodDonation.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching donation history', error: err.message });
  }
});

module.exports = router;
