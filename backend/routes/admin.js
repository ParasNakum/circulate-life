const express = require('express');
const router = express.Router();
const User = require('../models/User');
const BloodStorage = require('../models/BloodStorage');
const BloodRequest = require('../models/BloodRequest');
const Appointment = require('../models/Appointment');
const BloodDonation = require('../models/BloodDonation');
const BloodExpir = require('../models/BloodExpir');
const { authenticate, authorize } = require('../middleware/auth');

// Protect all admin routes
router.use(authenticate, authorize('admin'));

// Admin Dashboard Overview Stats
router.get('/stats', async (req, res) => {
  try {
    const recipient_count = await User.countDocuments({ role: 'recipient' });
    const donor_count = await User.countDocuments({ role: 'donor' });
    const total_user_count = recipient_count + donor_count;
    const total_requests = await BloodRequest.countDocuments();
    const pending_requests = await BloodRequest.countDocuments({ status: 'Pending' });
    const appointments_count = await Appointment.countDocuments();

    // Storage summary
    const storage = await BloodStorage.find().sort({ blood_group: 1 });
    const total_units = storage.reduce((sum, item) => sum + item.unit, 0);

    res.json({
      recipient_count,
      donor_count,
      total_user_count,
      total_requests,
      pending_requests,
      appointments_count,
      total_units,
      storage
    });
  } catch (err) {
    res.status(500).json({ message: 'Error loading admin stats', error: err.message });
  }
});

// Donors list
router.get('/donors', async (req, res) => {
  try {
    const donors = await User.find({ role: 'donor' }).select('-password').sort({ createdAt: -1 });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching donors', error: err.message });
  }
});

// Delete donor
router.delete('/donors/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donor removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting donor', error: err.message });
  }
});

// Recipients list
router.get('/recipients', async (req, res) => {
  try {
    const recipients = await User.find({ role: 'recipient' }).select('-password').sort({ createdAt: -1 });
    res.json(recipients);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipients', error: err.message });
  }
});

// Delete recipient
router.delete('/recipients/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipient removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting recipient', error: err.message });
  }
});

// Blood Storage: Get All
router.get('/blood-storage', async (req, res) => {
  try {
    const storage = await BloodStorage.find().sort({ blood_group: 1 });
    res.json(storage);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blood storage', error: err.message });
  }
});

// Blood Storage: Add Blood Entry
router.post('/blood-storage/add', async (req, res) => {
  try {
    const { donor_email, blood_group, unit } = req.body;
    const unitsToAdd = parseInt(unit, 10);
    if (!blood_group || isNaN(unitsToAdd) || unitsToAdd <= 0) {
      return res.status(400).json({ message: 'Valid blood group and units are required.' });
    }

    // Update storage
    let item = await BloodStorage.findOne({ blood_group });
    if (item) {
      item.unit += unitsToAdd;
      await item.save();
    } else {
      item = await BloodStorage.create({ blood_group, unit: unitsToAdd });
    }

    // Check if donor exists
    const donor = await User.findOne({ email: donor_email });

    // Record in blood donation history
    await BloodDonation.create({
      email: donor_email || 'walkin@circulatelife.org',
      donorName: donor ? donor.name : 'Walk-in Donor',
      blood_group,
      unit: unitsToAdd,
      blood_status: 'stored',
      certificate_id: 'CERT-' + Math.floor(100000 + Math.random() * 900000)
    });

    res.json({ message: 'Blood entry added successfully!', item });
  } catch (err) {
    res.status(500).json({ message: 'Error adding blood entry', error: err.message });
  }
});

// Blood Storage: Remove Blood Entry
router.post('/blood-storage/remove', async (req, res) => {
  try {
    const { blood_group, unit } = req.body;
    const unitsToRemove = parseInt(unit, 10);
    if (!blood_group || isNaN(unitsToRemove) || unitsToRemove <= 0) {
      return res.status(400).json({ message: 'Valid blood group and units are required.' });
    }

    let item = await BloodStorage.findOne({ blood_group });
    if (!item || item.unit < unitsToRemove) {
      return res.status(400).json({ message: 'Not enough blood units in storage to remove.' });
    }

    item.unit -= unitsToRemove;
    await item.save();

    await BloodDonation.create({
      email: 'admin@gmail.com',
      donorName: 'Admin Disposal',
      blood_group,
      unit: unitsToRemove,
      blood_status: 'removed'
    });

    res.json({ message: 'Blood entry removed successfully!', item });
  } catch (err) {
    res.status(500).json({ message: 'Error removing blood entry', error: err.message });
  }
});

// Blood Storage: Edit Unit
router.put('/blood-storage/:id', async (req, res) => {
  try {
    const { unit } = req.body;
    const item = await BloodStorage.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Blood group item not found.' });
    }

    item.unit = parseInt(unit, 10);
    await item.save();
    res.json({ message: 'Blood storage updated successfully!', item });
  } catch (err) {
    res.status(500).json({ message: 'Error updating blood storage', error: err.message });
  }
});

// Blood Storage: Add Expired Blood Entry
router.post('/blood-storage/add-expired', async (req, res) => {
  try {
    const { blood_group, unit } = req.body;
    const unitsExpired = parseInt(unit, 10);

    let item = await BloodStorage.findOne({ blood_group });
    if (item) {
      item.unit = Math.max(0, item.unit - unitsExpired);
      await item.save();
    }

    await BloodExpir.create({
      blood_group,
      unit: unitsExpired,
      expired_date: new Date()
    });

    res.json({ message: 'Expired blood entry recorded successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error recording expired blood', error: err.message });
  }
});

// Blood Storage History
router.get('/blood-storage/history', async (req, res) => {
  try {
    const donations = await BloodDonation.find().sort({ createdAt: -1 });
    const expired = await BloodExpir.find().sort({ expired_date: -1 });
    res.json({ donations, expired });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching storage history', error: err.message });
  }
});

// Blood Requests: List All
router.get('/requests', async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err.message });
  }
});

// Handle Blood Request (Accept / Reject)
router.post('/requests/handle', async (req, res) => {
  try {
    const { request_id, action } = req.body;
    const request = await BloodRequest.findById(request_id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found.' });
    }

    if (action === 'accept') {
      // Check storage
      const storageItem = await BloodStorage.findOne({ blood_group: request.blood_group });
      if (storageItem && storageItem.unit >= request.unit) {
        storageItem.unit -= request.unit;
        await storageItem.save();
      }
      request.status = 'Accepted';
    } else {
      request.status = 'Rejected';
    }

    await request.save();
    res.json({ message: `Blood request marked as ${request.status}!`, request });
  } catch (err) {
    res.status(500).json({ message: 'Error updating blood request', error: err.message });
  }
});

// Appointments: List All
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
});

// Handle Appointment (Accept / Reject)
router.post('/appointments/handle', async (req, res) => {
  try {
    const { appointment_id, action } = req.body;
    const appointment = await Appointment.findById(appointment_id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    appointment.status = action === 'accept' ? 'Accepted' : 'Rejected';
    await appointment.save();

    res.json({ message: `Appointment marked as ${appointment.status}!`, appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating appointment', error: err.message });
  }
});

module.exports = router;
