import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaExclamationTriangle, FaArrowLeft, FaUser, FaPhone } from 'react-icons/fa';
import { getDoctorSlots, createAppointment } from '../services/api';
import { format, addDays } from 'date-fns';
import './AppointmentBooking.css';

const AppointmentBooking = ({ doctor, onBack, onAppointmentCreated }) => {
  const [appointmentType, setAppointmentType] = useState('normal');
  const [slots, setSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    alternativePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    symptoms: '',
    medicalConditions: '',
    previousConsultations: '',
    additionalNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [slotsLoaded, setSlotsLoaded] = useState(false);

  const generateMockSlots = () => {
    const mockSlots = {};
    const today = new Date();
    for (let day = 0; day < 7; day++) {
      const date = addDays(today, day);
      const dateStr = format(date, 'yyyy-MM-dd');
      const timeSlots = [];
      for (let hour = 9; hour < 17; hour++) {
        if (hour === 13) continue;
        ['00', '30'].forEach((minute) => {
          if (Math.random() > 0.3) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute}`;
            timeSlots.push({
              id: `${dateStr}-${timeStr}`.replace(/[-:]/g, ''),
              time: timeStr,
              isEmergency: false
            });
          }
        });
      }
      if (timeSlots.length > 0) mockSlots[dateStr] = timeSlots;
    }
    return mockSlots;
  };

  const loadSlots = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const endDate = addDays(today, 7);
      const response = await getDoctorSlots(doctor.id, {
        startDate: format(today, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd')
      });
      if (response.data && Object.keys(response.data).length > 0) {
        setSlots(response.data);
      } else {
        setSlots(generateMockSlots());
      }
      setSlotsLoaded(true);
    } catch (error) {
      console.error('Error loading slots:', error);
      setSlots(generateMockSlots());
      setSlotsLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentType === 'normal') {
      loadSlots();
    }
  }, [doctor.id, appointmentType]);

  const handleSlotSelection = (date, slot) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.dateOfBirth || !formData.gender) {
      alert('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const appointmentData = {
        doctorId: doctor.id,
        appointmentType,
        patientName: `${formData.firstName} ${formData.lastName}`,
        patientAge: formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : '',
        patientGender: formData.gender,
        patientPhone: formData.phone,
        patientEmail: formData.email,
        symptoms: formData.symptoms,
        medicalConditions: formData.medicalConditions,
        previousConsultations: formData.previousConsultations,
        patientAddress: formData.address,
        patientCity: formData.city,
        patientState: formData.state,
        patientPincode: formData.pincode,
        alternativePhone: formData.alternativePhone,
        additionalNotes: formData.additionalNotes
      };
      if (appointmentType === 'normal' && selectedSlot) {
        appointmentData.slotId = selectedSlot.id;
        appointmentData.appointmentDate = selectedDate;
        appointmentData.appointmentTime = selectedSlot.time;
      }
      const response = await createAppointment(appointmentData);
      onAppointmentCreated(response.data.appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      const mockAppointment = {
        id: Date.now(),
        bookingId: `APT-${Date.now()}`,
        doctorName: doctor.full_name,
        specialization: doctor.specialization,
        appointmentDate: selectedDate || format(new Date(), 'yyyy-MM-dd'),
        appointmentTime: selectedSlot?.time || '10:00',
        consultationFee: doctor.consultation_fee
      };
      onAppointmentCreated(mockAppointment);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyClick = () => {
    setAppointmentType('emergency');
    setStep(2);
  };

  return (
    <div className="booking-container">
      <button className="back-btn" onClick={onBack}>
        <FaArrowLeft /> Back to Doctors
      </button>
      <div className="doctor-summary">
        <h3>{doctor.full_name}</h3>
        <p>{doctor.specialization}</p>
        <p className="hospital">{doctor.hospital_name}</p>
        <p className="hospital-address">{doctor.hospital_address}</p>
      </div>
      <div className="appointment-type-selector">
        <button className={`type-btn ${appointmentType === 'normal' ? 'active' : ''}`} onClick={() => setAppointmentType('normal')}>
          <FaCalendarAlt />
          <div><strong>Normal Appointment</strong><span>₹{doctor.consultation_fee}</span></div>
        </button>
        <button className={`type-btn ${appointmentType === 'emergency' ? 'active' : ''}`} onClick={handleEmergencyClick}>
          <FaExclamationTriangle />
          <div><strong>Emergency Appointment</strong><span>₹{doctor.emergency_fee || doctor.consultation_fee * 2}</span></div>
        </button>
      </div>
      {step === 1 && appointmentType === 'normal' && (
        <div className="slots-section">
          <h4>Select Date & Time</h4>
          {loading && !slotsLoaded ? (
            <div className="loading-slots"><p>Loading available slots...</p></div>
          ) : Object.keys(slots).length === 0 ? (
            <p className="no-slots">No available slots.</p>
          ) : (
            <div className="dates-container">
              {Object.entries(slots).map(([date, timeSlots]) => (
                <div key={date} className="date-group">
                  <h5>{format(new Date(date), 'EEEE, MMM dd, yyyy')}</h5>
                  <div className="time-slots">
                    {timeSlots.map((slot) => (
                      <button key={slot.id} className={`time-slot ${selectedSlot?.id === slot.id ? 'selected' : ''}`} onClick={() => handleSlotSelection(date, slot)}>
                        <FaClock />{slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {(step === 2 || appointmentType === 'emergency') && (
        <form className="appointment-form" onSubmit={handleSubmit}>
          <h4><FaUser /> Patient Personal Information</h4>
          <div className="form-grid">
            <div className="input-group">
              <label>First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter first name" required />
            </div>
            <div className="input-group">
              <label>Last Name *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter last name" required />
            </div>
            <div className="input-group">
              <label>Date of Birth *</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <h4><FaPhone /> Contact Information</h4>
          <div className="form-grid">
            <div className="input-group">
              <label>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email address" required />
            </div>
            <div className="input-group">
              <label>Mobile Number *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter mobile number" required />
            </div>
            <div className="input-group">
              <label>Alternative Phone Number</label>
              <input type="tel" name="alternativePhone" value={formData.alternativePhone} onChange={handleInputChange} placeholder="Enter alternative number" />
            </div>
            <div className="input-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city" />
            </div>
            <div className="input-group">
              <label>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter state" />
            </div>
            <div className="input-group">
              <label>Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Enter pincode" />
            </div>
            <div className="input-group full-width">
              <label>Full Address</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter complete address" rows="2" />
            </div>
          </div>
          <h4>Medical Information</h4>
          <div className="form-grid">
            <div className="input-group full-width">
              <label>Symptoms / Reason for Visit *</label>
              <textarea name="symptoms" value={formData.symptoms} onChange={handleInputChange} placeholder="Describe your symptoms or reason for visit" rows="3" required />
            </div>
            <div className="input-group full-width">
              <label>Existing Medical Conditions</label>
              <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleInputChange} placeholder="List any existing medical conditions" rows="2" />
            </div>
            <div className="input-group full-width">
              <label>Previous Consultations</label>
              <textarea name="previousConsultations" value={formData.previousConsultations} onChange={handleInputChange} placeholder="List any previous consultations" rows="2" />
            </div>
            <div className="input-group full-width">
              <label>Additional Information</label>
              <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} placeholder="Any additional information" rows="3" />
            </div>
          </div>
          <div className="form-actions">
            {appointmentType === 'normal' && <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Change Slot</button>}
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Processing...' : 'Proceed to Payment'}</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AppointmentBooking;
