const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🌱 Seeding database...');

    // Create sample users (doctors)
    const hashedPassword = await bcrypt.hash('doctor123', 10);
    
    const doctors = [
      { email: 'dr.sharma@healthcare.com', name: 'Dr. Rajesh Sharma', specialization: 1, qualifications: 'MBBS, MD (Cardiology)', experience: 15, fee: 800, emergencyFee: 1500, hospital: 'Apollo Hospital', address: 'Sector 26, Delhi' },
      { email: 'dr.patel@healthcare.com', name: 'Dr. Priya Patel', specialization: 2, qualifications: 'MBBS, MD (Nephrology)', experience: 12, fee: 700, emergencyFee: 1300, hospital: 'Fortis Hospital', address: 'Vasant Kunj, Delhi' },
      { email: 'dr.kumar@healthcare.com', name: 'Dr. Amit Kumar', specialization: 3, qualifications: 'MBBS, MS (Ophthalmology)', experience: 10, fee: 600, emergencyFee: 1100, hospital: 'Max Hospital', address: 'Saket, Delhi' },
      { email: 'dr.singh@healthcare.com', name: 'Dr. Anjali Singh', specialization: 4, qualifications: 'MBBS, MD (Dermatology)', experience: 8, fee: 500, emergencyFee: 900, hospital: 'Medanta Hospital', address: 'Gurgaon' },
      { email: 'dr.verma@healthcare.com', name: 'Dr. Vikram Verma', specialization: 5, qualifications: 'MBBS, DM (Neurology)', experience: 18, fee: 1000, emergencyFee: 1800, hospital: 'AIIMS', address: 'Ansari Nagar, Delhi' },
      { email: 'dr.reddy@healthcare.com', name: 'Dr. Sanjay Reddy', specialization: 6, qualifications: 'MBBS, MS (Orthopedics)', experience: 14, fee: 750, emergencyFee: 1400, hospital: 'BLK Hospital', address: 'Pusa Road, Delhi' },
      { email: 'dr.mehta@healthcare.com', name: 'Dr. Neha Mehta', specialization: 7, qualifications: 'MBBS, MD (Pediatrics)', experience: 9, fee: 550, emergencyFee: 1000, hospital: 'Safdarjung Hospital', address: 'Ring Road, Delhi' },
      { email: 'dr.gupta@healthcare.com', name: 'Dr. Rahul Gupta', specialization: 8, qualifications: 'MBBS, MD (General Medicine)', experience: 11, fee: 400, emergencyFee: 800, hospital: 'Manipal Hospital', address: 'Dwarka, Delhi' }
    ];

    const doctorIds = [];

    for (const doc of doctors) {
      // Insert user
      const userResult = await client.query(
        'INSERT INTO users (email, password_hash, role, full_name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [doc.email, hashedPassword, 'doctor', doc.name, '+91-9876543210']
      );

      // Insert doctor
      const doctorResult = await client.query(
        `INSERT INTO doctors (user_id, specialization_id, qualifications, experience_years, 
         consultation_fee, emergency_fee, rating, total_reviews, hospital_name, hospital_address, is_available)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [userResult.rows[0].id, doc.specialization, doc.qualifications, doc.experience, 
         doc.fee, doc.emergencyFee, (4.0 + Math.random()).toFixed(2), Math.floor(Math.random() * 100) + 20,
         doc.hospital, doc.address, true]
      );

      doctorIds.push(doctorResult.rows[0].id);
      console.log(`✅ Created doctor: ${doc.name}`);
    }

    // Create time slots for next 7 days
    const today = new Date();
    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

    for (let day = 0; day < 7; day++) {
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + day);
      const dateStr = slotDate.toISOString().split('T')[0];

      for (const doctorId of doctorIds) {
        for (const time of timeSlots) {
          await client.query(
            'INSERT INTO time_slots (doctor_id, slot_date, slot_time, is_available, is_emergency_slot) VALUES ($1, $2, $3, $4, $5)',
            [doctorId, dateStr, time, true, time === '09:00' || time === '14:00']
          );
        }
      }
    }

    console.log('✅ Created time slots for 7 days');

    await client.query('COMMIT');
    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
}

seedDatabase();
