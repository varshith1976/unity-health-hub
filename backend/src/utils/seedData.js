const mongoose = require('mongoose');
const User = require('../models/mongodb/User');
const Doctor = require('../models/mongodb/Doctor');
const Specialization = require('../models/mongodb/Specialization');
const TimeSlot = require('../models/mongodb/TimeSlot');
const bcrypt = require('bcryptjs');

// Doctor data for each specialization
const DOCTOR_DATA = {
  'General Physician': [
    { fullName: 'Dr. Sarah Johnson', exp: 15, fee: 500, rating: 4.8 },
    { fullName: 'Dr. Amit Kumar', exp: 12, fee: 450, rating: 4.7 },
    { fullName: 'Dr. Sunita Rao', exp: 10, fee: 400, rating: 4.6 },
    { fullName: 'Dr. Vikram Singh', exp: 8, fee: 350, rating: 4.5 },
    { fullName: 'Dr. Anita Gupta', exp: 14, fee: 550, rating: 4.9 },
    { fullName: 'Dr. Sanjay Verma', exp: 6, fee: 300, rating: 4.4 },
    { fullName: 'Dr. Kavita Reddy', exp: 11, fee: 480, rating: 4.7 },
    { fullName: 'Dr. Raj Patel', exp: 9, fee: 380, rating: 4.5 },
    { fullName: 'Dr. Meera Sharma', exp: 7, fee: 320, rating: 4.3 },
    { fullName: 'Dr. Rajesh Joshi', exp: 13, fee: 520, rating: 4.8 }
  ],
  'Cardiologist': [
    { fullName: 'Dr. Michael Chen', exp: 12, fee: 1000, rating: 4.9 },
    { fullName: 'Dr. Ramesh Agarwal', exp: 15, fee: 1200, rating: 4.9 },
    { fullName: 'Dr. Suresh Kumar', exp: 10, fee: 900, rating: 4.7 },
    { fullName: 'Dr. Prakash Reddy', exp: 8, fee: 800, rating: 4.6 },
    { fullName: 'Dr. Deepak Sharma', exp: 14, fee: 1100, rating: 4.8 },
    { fullName: 'Dr. Arun Patel', exp: 6, fee: 700, rating: 4.5 },
    { fullName: 'Dr. Naveen Gupta', exp: 11, fee: 950, rating: 4.7 },
    { fullName: 'Dr. Kiran Rao', exp: 9, fee: 850, rating: 4.6 },
    { fullName: 'Dr. Vijay Singh', exp: 7, fee: 750, rating: 4.4 },
    { fullName: 'Dr. Ajay Verma', exp: 13, fee: 1050, rating: 4.8 }
  ],
  'Dermatologist': [
    { fullName: 'Dr. Priya Sharma', exp: 8, fee: 800, rating: 4.7 },
    { fullName: 'Dr. Kavita Singh', exp: 12, fee: 900, rating: 4.8 },
    { fullName: 'Dr. Anjali Patel', exp: 6, fee: 650, rating: 4.5 },
    { fullName: 'Dr. Neha Gupta', exp: 10, fee: 850, rating: 4.7 },
    { fullName: 'Dr. Pooja Reddy', exp: 5, fee: 600, rating: 4.4 },
    { fullName: 'Dr. Richa Sharma', exp: 14, fee: 1000, rating: 4.9 },
    { fullName: 'Dr. Monika Kumar', exp: 7, fee: 700, rating: 4.6 },
    { fullName: 'Dr. Swati Verma', exp: 9, fee: 780, rating: 4.6 },
    { fullName: 'Dr. Divya Agarwal', exp: 4, fee: 550, rating: 4.3 },
    { fullName: 'Dr. Bhavna Rao', exp: 11, fee: 880, rating: 4.7 }
  ],
  'Pediatrician': [
    { fullName: 'Dr. Rajesh Kumar', exp: 10, fee: 700, rating: 4.9 },
    { fullName: 'Dr. Lakshmi Devi', exp: 15, fee: 850, rating: 4.9 },
    { fullName: 'Dr. Venkat Rao', exp: 8, fee: 600, rating: 4.6 },
    { fullName: 'Dr. Harish Singh', exp: 12, fee: 780, rating: 4.8 },
    { fullName: 'Dr. Radhika Patel', exp: 6, fee: 550, rating: 4.5 },
    { fullName: 'Dr. Kishore Kumar', exp: 14, fee: 820, rating: 4.8 },
    { fullName: 'Dr. Padma Gupta', exp: 7, fee: 580, rating: 4.5 },
    { fullName: 'Dr. Murali Reddy', exp: 11, fee: 750, rating: 4.7 },
    { fullName: 'Dr. Leela Sharma', exp: 5, fee: 500, rating: 4.4 },
    { fullName: 'Dr. Srinivas Verma', exp: 9, fee: 680, rating: 4.6 }
  ],
  'Neurologist': [
    { fullName: 'Dr. Ananya Patel', exp: 14, fee: 1200, rating: 4.8 },
    { fullName: 'Dr. Sanjay Mishra', exp: 16, fee: 1500, rating: 4.9 },
    { fullName: 'Dr. Arvind Singh', exp: 10, fee: 1000, rating: 4.7 },
    { fullName: 'Dr. Chandrashekar Rao', exp: 12, fee: 1100, rating: 4.8 },
    { fullName: 'Dr. Gopal Krishna', exp: 8, fee: 900, rating: 4.6 },
    { fullName: 'Dr. Harsha Vardhan', exp: 15, fee: 1300, rating: 4.9 },
    { fullName: 'Dr. Irfan Ahmed', exp: 7, fee: 850, rating: 4.5 },
    { fullName: 'Dr. Jai Kumar', exp: 11, fee: 1050, rating: 4.7 },
    { fullName: 'Dr. Karthik Raj', exp: 6, fee: 800, rating: 4.4 },
    { fullName: 'Dr. Lokesh Gupta', exp: 13, fee: 1150, rating: 4.8 }
  ]
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Specialization.deleteMany({});
    await TimeSlot.deleteMany({});
    
    console.log('✅ Cleared existing data');
    
    // Seed Specializations
    const specs = await Specialization.seedDefaults();
    console.log('✅ Seeded specializations');
    
    // Create doctors for each specialization
    const createdDoctors = [];
    
    for (const [specializationName, doctorsList] of Object.entries(DOCTOR_DATA)) {
      const spec = await Specialization.findOne({ name: specializationName });
      if (!spec) continue;
      
      for (let i = 0; i < doctorsList.length; i++) {
        const docData = doctorsList[i];
        const email = `${docData.fullName.toLowerCase().replace(/[^a-z]/g, '').replace(/\s/g, '')}${i}@healthhub.com`;
        
        // Create user
        const hashedPassword = await bcrypt.hash('doctor123', 10);
        const user = await User.create({
          email: email,
          password: hashedPassword,
          role: 'doctor',
          fullName: docData.fullName,
          phone: `+91 987654${String(3000 + createdDoctors.length).padStart(4, '0')}`
        });
        
        // Create doctor profile
        const doctor = await Doctor.create({
          userId: user._id,
          specializationId: spec._id,
          specialization: specializationName,
          qualifications: i < 3 ? 'MD, DM' : i < 6 ? 'MD, DNB' : 'MBBS, MD',
          experienceYears: docData.exp,
          consultationFee: docData.fee,
          emergencyFee: docData.fee * 2,
          rating: docData.rating,
          totalReviews: Math.floor(50 + Math.random() * 300),
          hospitalName: 'Unity Health Hub',
          hospitalAddress: 'Banjara Hills, Hyderabad',
          bio: `Experienced ${specializationName} with ${docData.exp} years of practice.`,
          languages: ['English', 'Hindi']
        });
        
        createdDoctors.push(doctor);
      }
      
      console.log(`✅ Created ${doctorsList.length} ${specializationName} doctors`);
    }
    
    // Generate time slots for all doctors
    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    
    for (const doctor of createdDoctors) {
      const today = new Date();
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + day);
        
        // Skip Sundays
        if (date.getDay() === 0) continue;
        
        for (const time of timeSlots) {
          await TimeSlot.create({
            doctorId: doctor._id,
            slotDate: date,
            slotTime: time,
            isAvailable: true,
            isEmergencySlot: Math.random() > 0.8
          });
        }
      }
    }
    console.log('✅ Generated time slots for all doctors');
    
    // Create a sample patient user
    const hashedPassword = await bcrypt.hash('patient123', 10);
    await User.create({
      fullName: 'Test Patient',
      email: 'patient@healthhub.com',
      phone: '+91 9876543000',
      role: 'patient',
      password: hashedPassword
    });
    console.log('✅ Created sample patient user');
    
    console.log('🎉 Database seeding completed!');
    console.log(`📊 Total doctors: ${createdDoctors.length}`);
    console.log('📝 Login credentials:');
    console.log('   Doctor: sarah0@healthhub.com / doctor123');
    console.log('   Patient: patient@healthhub.com / patient123');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

module.exports = seedDatabase;
