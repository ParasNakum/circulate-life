const mongoose = require('mongoose');

const bloodDonationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    donorName: {
      type: String,
      default: ''
    },
    blood_group: {
      type: String,
      required: true
    },
    unit: {
      type: Number,
      required: true,
      default: 1
    },
    blood_status: {
      type: String,
      enum: ['active', 'stored', 'removed'],
      default: 'stored'
    },
    certificate_id: {
      type: String,
      default: ''
    },
    donation_date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodDonation', bloodDonationSchema);
