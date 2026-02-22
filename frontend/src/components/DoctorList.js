import React from 'react';
import { FaStar, FaUserMd, FaHospital, FaMoneyBillWave, FaCalendarCheck } from 'react-icons/fa';
import './DoctorList.css';

const DoctorList = ({ doctors, onSelectDoctor }) => {
  if (doctors.length === 0) {
    return (
      <div className="no-results">
        <FaUserMd className="no-results-icon" />
        <h3>No doctors found</h3>
        <p>Try adjusting your search filters</p>
      </div>
    );
  }

  // Normalize doctor data - handle both MongoDB and mock data formats
  const normalizeDoctor = (doctor) => {
    // Check if it's MongoDB format (with userId populated)
    const userName = doctor.userId?.fullName || doctor.fullName || doctor.full_name;
    
    return {
      id: doctor._id || doctor.id || doctor.mockId,
      full_name: userName,
      specialization: doctor.specialization,
      // Handle both naming conventions (camelCase and snake_case)
      rating: doctor.rating || doctor.rating || 0,
      total_reviews: doctor.totalReviews || doctor.total_reviews || 0,
      experience_years: doctor.experienceYears || doctor.experience_years || 0,
      hospital_name: doctor.hospitalName || doctor.hospital_name || doctor.hospitalName || '',
      consultation_fee: doctor.consultationFee || doctor.consultation_fee || 0,
      qualifications: doctor.qualifications || doctor.qualifications || '',
      // Include full doctor object for appointment booking
      ...doctor
    };
  };

  return (
    <div className="doctors-container">
      <h3 className="results-title">Available Doctors ({doctors.length})</h3>
      <div className="doctors-grid">
        {doctors.map((doctor) => {
          const normalizedDoctor = normalizeDoctor(doctor);
          return (
            <div key={normalizedDoctor.id} className="doctor-card">
              <div className="doctor-header">
                <div className="doctor-avatar">
                  {doctor.image_url ? (
                    <img src={doctor.image_url} alt={normalizedDoctor.full_name} />
                  ) : (
                    <FaUserMd />
                  )}
                </div>
                <div className="doctor-info">
                  <h4>{normalizedDoctor.full_name}</h4>
                  <p className="specialization">{normalizedDoctor.specialization}</p>
                  <div className="rating">
                    <FaStar className="star-icon" />
                    <span>{parseFloat(normalizedDoctor.rating || 0).toFixed(1)}</span>
                    <span className="reviews">({normalizedDoctor.total_reviews || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="doctor-details">
                <div className="detail-item">
                  <FaUserMd className="detail-icon" />
                  <span>{normalizedDoctor.experience_years} years experience</span>
                </div>
                <div className="detail-item">
                  <FaHospital className="detail-icon" />
                  <span>{normalizedDoctor.hospital_name}</span>
                </div>
                <div className="detail-item">
                  <FaMoneyBillWave className="detail-icon" />
                  <span>₹{normalizedDoctor.consultation_fee} consultation</span>
                </div>
              </div>

              <div className="doctor-qualifications">
                <strong>Qualifications:</strong>
                <p>{normalizedDoctor.qualifications}</p>
              </div>

              <button 
                className="btn btn-primary book-btn"
                onClick={() => onSelectDoctor(normalizedDoctor)}
              >
                <FaCalendarCheck />
                Book Appointment
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorList;
