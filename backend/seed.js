require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const BloodStorage = require('./models/BloodStorage');
const BloodRequest = require('./models/BloodRequest');
const Appointment = require('./models/Appointment');
const BloodDonation = require('./models/BloodDonation');
const BloodExpir = require('./models/BloodExpir');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/circulate_life';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing
    await User.deleteMany({});
    await BloodStorage.deleteMany({});
    await BloodRequest.deleteMany({});
    await Appointment.deleteMany({});
    await BloodDonation.deleteMany({});
    await BloodExpir.deleteMany({});

    const passwordHash = await bcrypt.hash('admin123', 10);
    const donorHash = await bcrypt.hash('donor123', 10);
    const recipientHash = await bcrypt.hash('recipient123', 10);

    // 1. Create Default Users
    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@gmail.com',
      password: passwordHash,
      role: 'admin'
    });

    const donor = await User.create({
      name: 'Paras Nakum',
      email: 'donor@gmail.com',
      password: donorHash,
      role: 'donor',
      dob: '2001-05-15',
      age: 24,
      body_weight: '68 kg',
      blood_group: 'O+',
      gender: 'Male',
      address: 'Ring Road, Surat, Gujarat',
      pincode: '395002',
      contact: '9712583381'
    });

    const recipient = await User.create({
      name: 'Rahul Sharma',
      email: 'recipient@gmail.com',
      password: recipientHash,
      role: 'recipient',
      dob: '1998-08-20',
      age: 27,
      body_weight: '72 kg',
      blood_group: 'B+',
      gender: 'Male',
      address: 'Varachha, Surat, Gujarat',
      pincode: '395006',
      contact: '9898765432'
    });

    console.log('✅ Users created: Admin, Donor, Recipient');

    // 2. Initialize Blood Storage
    const bloodInventory = [
      { blood_group: 'A+', unit: 18 },
      { blood_group: 'A-', unit: 9 },
      { blood_group: 'B+', unit: 25 },
      { blood_group: 'B-', unit: 7 },
      { blood_group: 'AB+', unit: 12 },
      { blood_group: 'AB-', unit: 5 },
      { blood_group: 'O+', unit: 32 },
      { blood_group: 'O-', unit: 14 }
    ];

    await BloodStorage.insertMany(bloodInventory);
    console.log('✅ Blood storage inventory initialized with 8 blood types');

    // 3. Create Sample Blood Requests
    await BloodRequest.create([
      {
        userId: recipient._id,
        userRole: 'recipient',
        username: recipient.name,
        name: 'Priya Patel',
        age: 26,
        blood_group: 'B+',
        reason_for_blood: 'Urgent surgery',
        when_required: 'Immediate',
        unit: 2,
        hospital_name: 'Civil Hospital Surat',
        doctor_name: 'Dr. R. K. Mehta',
        gender: 'Female',
        address: 'Majura Gate, Surat',
        pincode: '395001',
        contact: '9876543210',
        email: recipient.email,
        status: 'Pending'
      },
      {
        userId: donor._id,
        userRole: 'donor',
        username: donor.name,
        name: 'Amit Shah',
        age: 34,
        blood_group: 'O+',
        reason_for_blood: 'Accident recovery',
        when_required: 'Within 2 days',
        unit: 1,
        hospital_name: 'Sunshine Global Hospital',
        doctor_name: 'Dr. V. Joshi',
        gender: 'Male',
        address: 'Adajan, Surat',
        pincode: '395009',
        contact: '9825123456',
        email: donor.email,
        status: 'Accepted'
      }
    ]);
    console.log('✅ Sample blood requests created');

    // 4. Create Sample Appointments
    await Appointment.create([
      {
        userId: donor._id,
        blood_group: 'O+',
        email: donor.email,
        date: '2026-10-20',
        time: '10:30 AM',
        status: 'Pending'
      },
      {
        userId: donor._id,
        blood_group: 'O+',
        email: donor.email,
        date: '2026-09-10',
        time: '02:00 PM',
        status: 'Accepted'
      }
    ]);
    console.log('✅ Sample appointments created');

    // 5. Create Sample Donations & Certificates
    await BloodDonation.create([
      {
        email: donor.email,
        donorName: donor.name,
        blood_group: 'O+',
        unit: 1,
        blood_status: 'stored',
        certificate_id: 'CERT-849201',
        donation_date: new Date('2026-09-10')
      }
    ]);

    // 6. Expired Blood Entry
    await BloodExpir.create([
      {
        blood_group: 'AB-',
        unit: 1,
        expired_date: new Date('2026-09-01')
      }
    ]);

    console.log('🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seedDatabase();
