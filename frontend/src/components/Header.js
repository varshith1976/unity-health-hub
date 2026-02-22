import React, { useState } from 'react';
import { FaStethoscope, FaHome, FaCalendarAlt, FaUserMd, FaInfoCircle, FaPhoneAlt, FaSignOutAlt, FaUser, FaVideo, FaChartLine, FaChevronDown, FaPills } from 'react-icons/fa';
import './Header.css';

const Header = ({ currentView, onHomeClick, onFindDoctors, onAboutUs, onContact, onLogin, onSignup, isLoggedIn, user, onLogout, onViewDashboard, onStartConsultation, onMedicineReminder }) => {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);

  const handleLoginClick = (role) => {
    onLogin(role);
    setShowLoginDropdown(false);
  };

  const handleSignupClick = (role) => {
    onSignup(role);
    setShowSignupDropdown(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={onHomeClick}>
          <FaStethoscope className="logo-icon" />
          <div className="logo-text">
            <span className="logo-title">Unity Health Hub</span>
            <span className="logo-subtitle">Healthcare Made Simple</span>
          </div>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={onHomeClick}
          >
            <FaHome />
            <span>Home</span>
          </button>
          <button 
            className={`nav-link ${currentView === 'search' || currentView === 'doctorList' || currentView === 'booking' ? 'active' : ''}`}
            onClick={onFindDoctors}
          >
            <FaCalendarAlt />
            <span>Book Appointment</span>
          </button>
          <button className="nav-link" onClick={onFindDoctors}>
            <FaUserMd />
            <span>Find Doctors</span>
          </button>
          {isLoggedIn && (
            <>
              <button className="nav-link" onClick={onStartConsultation}>
                <FaVideo />
                <span>Telemedicine</span>
              </button>
              <button className="nav-link" onClick={onMedicineReminder}>
                <FaPills />
                <span>Medicine Reminder</span>
              </button>
              <button className="nav-link" onClick={onViewDashboard}>
                <FaChartLine />
                <span>Dashboard</span>
              </button>
            </>
          )}
          <button className="nav-link" onClick={onAboutUs}>
            <FaInfoCircle />
            <span>About Us</span>
          </button>
          <button className="nav-link" onClick={onContact}>
            <FaPhoneAlt />
            <span>Contact</span>
          </button>
        </nav>

        <div className="header-actions">
          {isLoggedIn ? (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '10px', color: '#fff' }}>
                <FaUser />
                <span>{user?.name || 'User'}</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>({user?.role})</span>
              </span>
              <button className="btn btn-outline" onClick={onLogout}>
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login Dropdown */}
              <div className="dropdown-container">
                <button 
                  className="btn btn-outline" 
                  onClick={() => {
                    setShowLoginDropdown(!showLoginDropdown);
                    setShowSignupDropdown(false);
                  }}
                >
                  Login <FaChevronDown style={{ fontSize: '10px', marginLeft: '5px' }} />
                </button>
                {showLoginDropdown && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleLoginClick('patient')}>
                      <FaUser /> Patient Login
                    </button>
                    <button onClick={() => handleLoginClick('doctor')}>
                      <FaUserMd /> Doctor Login
                    </button>
                    <button onClick={() => handleLoginClick('staff')}>
                      <FaUser /> Staff Login
                    </button>
                  </div>
                )}
              </div>

              {/* Signup Dropdown */}
              <div className="dropdown-container">
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setShowSignupDropdown(!showSignupDropdown);
                    setShowLoginDropdown(false);
                  }}
                >
                  Sign Up <FaChevronDown style={{ fontSize: '10px', marginLeft: '5px' }} />
                </button>
                {showSignupDropdown && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleSignupClick('patient')}>
                      <FaUser /> Patient Sign Up
                    </button>
                    <button onClick={() => handleSignupClick('doctor')}>
                      <FaUserMd /> Doctor Sign Up
                    </button>
                    <button onClick={() => handleSignupClick('staff')}>
                      <FaUser /> Staff Sign Up
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
