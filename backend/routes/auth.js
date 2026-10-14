const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

// Multer setup using memoryStorage (safe for both serverless and persistent servers)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Register Route
router.post('/register', upload.single('file_upload'), async (req, res) => {
  try {
    const {
      name,
      fullname,
      email,
      password,
      role = 'donor',
      dob,
      age,
      body_weight,
      blood_group,
      gender,
      address,
      pincode,
      contact
    } = req.body;

    const actualName = name || fullname;
    if (!actualName || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: actualName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role.toLowerCase(),
      dob: dob || '',
      age: Number(age) || 0,
      body_weight: body_weight || '',
      blood_group: blood_group || '',
      gender: gender || '',
      address: address || '',
      pincode: pincode || '',
      contact: contact || '',
      file_upload: req.file ? req.file.originalname : ''
    });

    await newUser.save();

    res.status(201).json({
      message: 'Registration successful! You can now log in.',
      userId: newUser._id
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      message: err.message.includes('buffering timed out')
        ? 'Database connection timed out. Please ensure MONGO_URI is set in Vercel Environment Variables.'
        : err.message || 'Server error during registration.'
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // Check if user exists in database
    let user = await User.findOne({ email: trimmedEmail });

    // Handle initial default admin if not created yet
    if (!user && trimmedEmail === 'admin@gmail.com' && password === 'admin123') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      user = await User.create({
        name: 'Administrator',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        blood_group: user.blood_group,
        contact: user.contact,
        address: user.address,
        pincode: user.pincode
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
});

// Get Current User Profile
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

// Update Profile
router.put('/update-profile', authenticate, async (req, res) => {
  try {
    const { name, contact, address, pincode, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (contact) user.contact = contact;
    if (address) user.address = address;
    if (pincode) user.pincode = pincode;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password.' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ message: 'Profile updated successfully!', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// Forgot Password - send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    res.json({
      message: 'OTP has been generated.',
      otp, // Provided directly for immediate testing & simulation
      expiresIn: '15 minutes'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error in forgot password request', error: err.message });
  }
});

// Verify OTP & Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetOtp: otp,
      resetOtpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = '';
    user.resetOtpExpires = null;
    await user.save();

    res.json({ message: 'Password has been reset successfully! You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
});

module.exports = router;
