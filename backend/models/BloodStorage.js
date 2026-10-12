const mongoose = require('mongoose');

const bloodStorageSchema = new mongoose.Schema(
  {
    blood_group: {
      type: String,
      required: true,
      unique: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    unit: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodStorage', bloodStorageSchema);
