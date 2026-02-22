import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendarCheck, FaStar, FaClock, FaVideo, FaStethoscope, FaPrescription, FaChartLine, FaSignOutAlt, FaCog, FaBell, FaCheckCircle, FaExclamationCircle, FaUserMd, FaMoneyBillWave, FaMicrophone, FaBrain, FaComments, FaTrash } from 'react-icons/fa';
import { getDoctorDashboardStats, getDoctorFeedbackRecent, getDoctorConsultations } from '../services/api';
import './DoctorDashboard.css';

const DoctorDashboard = ({ doctorId, onLogout, onStartConsultation, onViewAppointments }) => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    totalEarnings: 0,
    rating: 0,
    totalReviews: 0
  });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [consultationHistory, setConsultationHistory] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [doctorId]);

  useEffect(() => {
    if (activeTab === 'consultations') {
      loadConsultationHistory();
    }
  }, [activeTab]);

  const loadConsultationHistory = () => {
    // Load consultation history from localStorage
    const savedConsultations = localStorage.getItem('consultationHistory');
    if (savedConsultations) {
      const consultations = JSON.parse(savedConsultations);
      setConsultationHistory(consultations);
    } else {
      setConsultationHistory([]);
    }
  };

  const clearConsultationHistory = () => {
    if (window.confirm('Are you sure you want to clear all consultation history?')) {
      localStorage.removeItem('consultationHistory');
      setConsultationHistory([]);
      setSelectedConsultation(null);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      try {
        const [statsRes, feedbackRes] = await Promise.all([
          getDoctorDashboardStats(),
          getDoctorFeedbackRecent(5)
        ]);
        
        setStats(statsRes.data || {
          totalPatients: 156,
          todayAppointments: 8,
          pendingAppointments: 12,
          totalEarnings: 45000,
          rating: 4.8,
          totalReviews: 89
        });
        
        setRecentFeedback(feedbackRes.data || []);
      } catch (apiError) {
        // Use mock data if API fails
        console.log('Using mock data for doctor dashboard');
        setStats({
          totalPatients: 156,
          todayAppointments: 8,
          pendingAppointments: 12,
          totalEarnings: 45000,
          rating: 4.8,
          totalReviews: 89
        });
        
        setRecentFeedback([
          { id: 1, patientName: 'John Doe', rating: 5, feedbackText: 'Excellent consultation! Very professional.', date: new Date().toISOString() },
          { id: 2, patientName: 'Sarah Smith', rating: 4, feedbackText: 'Good experience overall.', date: new Date(Date.now() - 86400000).toISOString() },
          { id: 3, patientName: 'Mike Johnson', rating: 5, feedbackText: 'Very thorough and caring.', date: new Date(Date.now() - 172800000).toISOString() }
        ]);
      }

      // Mock upcoming appointments
      setUpcomingAppointments([
        {
          id: 1,
          patientName: 'Emily Davis',
          appointmentTime: '09:00 AM',
          appointmentType: 'video',
          status: 'confirmed',
          symptoms: 'Follow-up consultation'
        },
        {
          id: 2,
          patientName: 'Robert Wilson',
          appointmentTime: '10:30 AM',
          appointmentType: 'normal',
          status: 'confirmed',
          symptoms: 'Headache and dizziness'
        },
        {
          id: 3,
          patientName: 'Lisa Brown',
          appointmentTime: '02:00 PM',
          appointmentType: 'emergency',
          status: 'pending',
          symptoms: 'Chest pain'
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const handleStartConsultation = (appointment) => {
    setActiveConsultation(appointment);
    if (onStartConsultation) {
      onStartConsultation(appointment);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'} />
    ));
  };

  if (loading) {
    return (
      <div className="doctor-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="doctor-avatar">
            <FaUserMd />
          </div>
          <div className="doctor-info">
            <h3>Dr. Sharma</h3>
            <span className="specialization">Cardiologist</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartLine /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <FaCalendarCheck /> Appointments
          </button>
          <button 
            className={`nav-item ${activeTab === 'consultations' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            <FaVideo /> Consultations
          </button>
          <button 
            className={`nav-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            <FaPrescription /> Prescriptions
          </button>
          <button 
            className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <FaStar /> Feedback
          </button>
          <button className="nav-item">
            <FaCog /> Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Doctor Dashboard</h1>
            <p>Welcome back! Here's your practice overview.</p>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            <button className="btn btn-primary" onClick={onStartConsultation}>
              <FaVideo /> Start Consultation
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon patients">
              <FaUser />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalPatients}</span>
              <span className="stat-label">Total Patients</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon appointments">
              <FaCalendarCheck />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.todayAppointments}</span>
              <span className="stat-label">Today's Appointments</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <FaClock />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.pendingAppointments}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon earnings">
              <FaMoneyBillWave />
            </div>
            <div className="stat-content">
              <span className="stat-value">{formatCurrency(stats.totalEarnings)}</span>
              <span className="stat-label">Total Earnings</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rating">
              <FaStar />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.rating}</span>
              <span className="stat-label">{stats.totalReviews} Reviews</span>
            </div>
          </div>
        </div>

        {/* Content Grid - Only show on dashboard tab */}
        {activeTab === 'dashboard' && (
          <div className="content-grid">
            {/* Upcoming Appointments */}
            <div className="content-card appointments-card">
              <div className="card-header">
                <h2><FaCalendarCheck /> Upcoming Appointments</h2>
                <button className="view-all-btn" onClick={() => setActiveTab('appointments')}>View All</button>
              </div>
              <div className="appointments-list">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-time">
                      <span className="time">{appointment.appointmentTime}</span>
                      <span className={`type ${appointment.appointmentType}`}>
                        {appointment.appointmentType === 'video' ? <FaVideo /> : <FaStethoscope />}
                        {appointment.appointmentType}
                      </span>
                    </div>
                    <div className="appointment-details">
                      <h4>{appointment.patientName}</h4>
                      <p>{appointment.symptoms}</p>
                    </div>
                    <div className="appointment-actions">
                      {appointment.status === 'confirmed' ? (
                        <span className="status confirmed"><FaCheckCircle /> Confirmed</span>
                      ) : (
                        <span className="status pending"><FaExclamationCircle /> Pending</span>
                      )}
                      {appointment.appointmentType === 'video' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStartConsultation(appointment)}
                        >
                          Start Call
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="content-card feedback-card">
              <div className="card-header">
                <h2><FaStar /> Recent Feedback</h2>
                <button className="view-all-btn" onClick={() => setActiveTab('feedback')}>View All</button>
              </div>
              <div className="feedback-list">
                {recentFeedback.length > 0 ? (
                  recentFeedback.map((feedback) => (
                    <div key={feedback.id} className="feedback-item">
                      <div className="feedback-header">
                        <span className="patient-name">{feedback.patientName}</span>
                        <div className="rating">
                          {renderStars(feedback.rating)}
                          <span className="rating-value">{feedback.rating}.0</span>
                        </div>
                      </div>
                      <p className="feedback-text">{feedback.feedbackText}</p>
                      <span className="feedback-date">{formatDate(feedback.date)}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-feedback">
                    <p>No feedback yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="tab-content">
            <div className="content-card">
              <div className="card-header">
                <h2><FaCalendarCheck /> All Appointments</h2>
              </div>
              <div className="appointments-list">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-time">
                      <span className="time">{appointment.appointmentTime}</span>
                      <span className={`type ${appointment.appointmentType}`}>
                        {appointment.appointmentType === 'video' ? <FaVideo /> : <FaStethoscope />}
                        {appointment.appointmentType}
                      </span>
                    </div>
                    <div className="appointment-details">
                      <h4>{appointment.patientName}</h4>
                      <p>{appointment.symptoms}</p>
                    </div>
                    <div className="appointment-actions">
                      {appointment.status === 'confirmed' ? (
                        <span className="status confirmed"><FaCheckCircle /> Confirmed</span>
                      ) : (
                        <span className="status pending"><FaExclamationCircle /> Pending</span>
                      )}
                      {appointment.appointmentType === 'video' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStartConsultation(appointment)}
                        >
                          Start Call
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <div className="consultations-section">
            <div className="consultations-header">
              <h2><FaVideo /> Consultation History</h2>
              {consultationHistory.length > 0 && (
                <button className="btn btn-secondary" onClick={clearConsultationHistory}>
                  <FaTrash /> Clear History
                </button>
              )}
            </div>
            
            {consultationHistory.length > 0 ? (
              <div className="consultations-container">
                <div className="consultations-list">
                  {consultationHistory.map((consultation, index) => (
                    <div 
                      key={index} 
                      className={`consultation-item ${selectedConsultation === index ? 'selected' : ''}`}
                      onClick={() => setSelectedConsultation(index)}
                    >
                      <div className="consultation-header">
                        <div className="doctor-name">
                          <FaUserMd /> {consultation.doctorName || 'Doctor'}
                        </div>
                        <div className="consultation-date">
                          {formatDateTime(consultation.date || new Date())}
                        </div>
                      </div>
                      <div className="consultation-stats">
                        <div className="stat-item">
                          <FaClock />
                          <span className="label">Duration:</span>
                          <span className="value">{formatDuration(consultation.duration)}</span>
                        </div>
                        <div className="stat-item">
                          <FaMicrophone />
                          <span className="label">Patient:</span>
                          <span className="value">{formatDuration(consultation.patientSpeakingTime)}</span>
                        </div>
                        <div className="stat-item">
                          <FaBrain />
                          <span className="label">AI Response:</span>
                          <span className="value">{formatDuration(consultation.aiSpeakingTime)}</span>
                        </div>
                        <div className="stat-item">
                          <FaComments />
                          <span className="label">Messages:</span>
                          <span className="value">{consultation.totalMessages || consultation.transcript?.length || 0}</span>
                        </div>
                      </div>
                      {consultation.rating && (
                        <div className="consultation-rating">
                          <span className="label">Rating:</span>
                          <div className="stars">
                            {renderStars(consultation.rating)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Consultation Details */}
                {selectedConsultation !== null && consultationHistory[selectedConsultation] && (
                  <div className="consultation-details">
                    <h3>Consultation Details</h3>
                    <div className="detail-section">
                      <h4>Transcript</h4>
                      <div className="transcript-view">
                        {consultationHistory[selectedConsultation].transcript?.map((msg, idx) => (
                          <div key={idx} className={`transcript-msg ${msg.speaker}`}>
                            <span className="msg-speaker">
                              {msg.speaker === 'patient' ? '👤 You' : msg.speaker === 'ai' ? '🤖 AI Doctor' : '👨‍⚕️ Doctor'}:
                            </span>
                            <span className="msg-text">{msg.text}</span>
                            <span className="msg-time">{msg.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {consultationHistory[selectedConsultation].feedbackText && (
                      <div className="detail-section">
                        <h4>Feedback</h4>
                        <p>{consultationHistory[selectedConsultation].feedbackText}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-consultations">
                <FaVideo style={{ fontSize: '3rem', opacity: 0.5 }} />
                <p>No consultation history yet</p>
                <p className="subtitle">Start a video consultation to see details here</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {activeTab === 'dashboard' && (
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-card" onClick={onStartConsultation}>
                <FaVideo className="action-icon" />
                <span>Start Video Call</span>
              </button>
              <button className="action-card" onClick={() => setActiveTab('appointments')}>
                <FaCalendarCheck className="action-icon" />
                <span>View Schedule</span>
              </button>
              <button className="action-card">
                <FaPrescription className="action-icon" />
                <span>Write Prescription</span>
              </button>
              <button className="action-card">
                <FaUser className="action-icon" />
                <span>Patient Records</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
