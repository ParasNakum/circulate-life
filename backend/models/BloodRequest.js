const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userRole: {
      type: String,
      enum: ['donor', 'recipient'],
      default: 'recipient'
    },
    username: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    blood_group: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    reason_for_blood: {
      type: String,
      required: true
    },
    when_required: {
      type: String,
      required: true
    },
    unit: {
      type: Number,
      required: true,
      min: 1
    },
    hospital_name: {
      type: String,
      required: true
    },
    doctor_name: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    pincode: {
      type: String,
      default: ''
    },
    contact: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    file_upload: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
