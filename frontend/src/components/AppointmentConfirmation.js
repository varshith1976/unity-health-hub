import React from 'react';
import { FaCheckCircle, FaDownload, FaCalendarAlt, FaUserMd, FaMapMarkerAlt } from 'react-icons/fa';
import './AppointmentConfirmation.css';

const AppointmentConfirmation = ({ appointment }) => {
  const handleDownloadReceipt = () => {
    const receiptContent = `
      UNITY HEALTH HUB - APPOINTMENT RECEIPT
      =====================================
      
      Booking ID: ${appointment.booking_id}
      
      PATIENT DETAILS:
      Name: ${appointment.patient_name}
      Age: ${appointment.patient_age}
      Gender: ${appointment.patient_gender}
      Phone: ${appointment.patient_phone}
      Email: ${appointment.patient_email}
      
      DOCTOR DETAILS:
      Name: ${appointment.doctor_name}
      Specialization: ${appointment.specialization}
      Hospital: ${appointment.hospital_name}
      Address: ${appointment.hospital_address}
      
      APPOINTMENT DETAILS:
      Date: ${new Date(appointment.appointment_date).toLocaleDateString()}
      Time: ${appointment.appointment_time}
      Type: ${appointment.appointment_type.toUpperCase()}
      
      PAYMENT DETAILS:
      Amount: ₹${appointment.consultation_fee}
      Status: ${appointment.payment_status.toUpperCase()}
      Transaction ID: ${appointment.transaction_id}
      Payment ID: ${appointment.payment_id}
      
      =====================================
      Thank you for choosing Unity Health Hub!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${appointment.booking_id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="confirmation-container">
      <div className="success-animation">
        <FaCheckCircle className="success-icon" />
        <h2>Appointment Confirmed!</h2>
        <p>Your appointment has been successfully booked</p>
      </div>

      <div className="confirmation-card">
        <div className="booking-id-section">
          <span className="label">Booking ID</span>
          <h3 className="booking-id">{appointment.booking_id}</h3>
          <span className="save-note">Please save this ID for future reference</span>
        </div>

        <div className="details-section">
          <div className="detail-group">
            <FaUserMd className="group-icon" />
            <div>
              <h4>Doctor Details</h4>
              <p className="doctor-name">{appointment.doctor_name}</p>
              <p className="specialization">{appointment.specialization}</p>
            </div>
          </div>

          <div className="detail-group">
            <FaCalendarAlt className="group-icon" />
            <div>
              <h4>Appointment Schedule</h4>
              <p className="date">{new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p className="time">{appointment.appointment_time}</p>
              <span className={`badge badge-${appointment.appointment_type === 'emergency' ? 'danger' : 'success'}`}>
                {appointment.appointment_type.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="detail-group">
            <FaMapMarkerAlt className="group-icon" />
            <div>
              <h4>Location</h4>
              <p className="hospital">{appointment.hospital_name}</p>
              <p className="address">{appointment.hospital_address}</p>
            </div>
          </div>
        </div>

        <div className="patient-info">
          <h4>Patient Information</h4>
          <div className="info-grid">
            <div>
              <span className="label">Name:</span>
              <span>{appointment.patient_name}</span>
            </div>
            <div>
              <span className="label">Age:</span>
              <span>{appointment.patient_age} years</span>
            </div>
            <div>
              <span className="label">Gender:</span>
              <span>{appointment.patient_gender}</span>
            </div>
            <div>
              <span className="label">Phone:</span>
              <span>{appointment.patient_phone}</span>
            </div>
          </div>
        </div>

        <div className="payment-info-section">
          <h4>Payment Information</h4>
          <div className="payment-details">
            <div className="payment-row">
              <span>Consultation Fee:</span>
              <strong>₹{appointment.consultation_fee}</strong>
            </div>
            <div className="payment-row">
              <span>Payment Status:</span>
              <span className="badge badge-success">{appointment.payment_status.toUpperCase()}</span>
            </div>
            <div className="payment-row">
              <span>Transaction ID:</span>
              <span className="transaction-id">{appointment.transaction_id}</span>
            </div>
          </div>
        </div>

        <button className="btn btn-primary download-btn" onClick={handleDownloadReceipt}>
          <FaDownload />
          Download Receipt
        </button>
      </div>

      <div className="instructions">
        <h4>Important Instructions</h4>
        <ul>
          <li>Please arrive 15 minutes before your scheduled appointment time</li>
          <li>Bring a valid ID proof and this booking confirmation</li>
          <li>Carry any previous medical records or prescriptions</li>
          <li>For cancellations, contact us at least 24 hours in advance</li>
        </ul>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
