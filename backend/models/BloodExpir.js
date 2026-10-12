const mongoose = require('mongoose');

const bloodExpirSchema = new mongoose.Schema(
  {
    blood_group: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    unit: {
      type: Number,
      required: true,
      min: 1
    },
    expired_date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodExpir', bloodExpirSchema);
