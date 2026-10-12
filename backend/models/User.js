const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'donor', 'recipient'],
      default: 'donor'
    },
    // Donor specific fields
    dob: { type: String, default: '' },
    age: { type: Number, default: 0 },
    body_weight: { type: String, default: '' },
    blood_group: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
      default: ''
    },
    gender: { type: String, default: '' },
    address: { type: String, default: '' },
    pincode: { type: String, default: '' },
    contact: { type: String, default: '' },
    file_upload: { type: String, default: '' },
    // OTP simulation
    resetOtp: { type: String, default: '' },
    resetOtpExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
