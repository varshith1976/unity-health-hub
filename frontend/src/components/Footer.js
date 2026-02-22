import React from 'react';
import { FaStethoscope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart, FaAmbulance, FaUserMd, FaCalendarAlt, FaShieldAlt, FaClock } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section about-section">
            <div className="footer-logo">
              <FaStethoscope className="footer-logo-icon" />
              <span>Unity Health Hub</span>
            </div>
            <p className="about-text">
              Your trusted healthcare companion. We make it easy to find the best doctors 
              and book appointments instantly. Quality healthcare is just a click away.
            </p>
            <div className="footer-badges">
              <span className="footer-badge"><FaAmbulance /> 24/7 Emergency</span>
              <span className="footer-badge"><FaShieldAlt /> Safe & Secure</span>
            </div>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Find Doctors</a></li>
              <li><a href="#">Book Appointment</a></li>
              <li><a href="#">Specializations</a></li>
              <li><a href="#">Emergency Care</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><a href="#">Online Consultation</a></li>
              <li><a href="#">Video Consultation</a></li>
              <li><a href="#">Health Checkups</a></li>
              <li><a href="#">Lab Tests</a></li>
              <li><a href="#">Medicine Delivery</a></li>
              <li><a href="#">Ambulance Service</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Unity Health Hub, Medical Complex<br/>123 Healthcare Street, City Center<br/>New Delhi, DL 110001</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+91 1234567890<br/>+91 9876543210</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>support@unityhealthhub.com<br/>info@unityhealthhub.com</span>
              </div>
              <div className="contact-item">
                <FaClock className="contact-icon" />
                <span>24/7 Emergency Services<br/>Mon-Sat: 9:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-features">
          <div className="feature-item">
            <FaUserMd />
            <span>500+ Verified Doctors</span>
          </div>
          <div className="feature-item">
            <FaCalendarAlt />
            <span>Instant Booking</span>
          </div>
          <div className="feature-item">
            <FaHeart />
            <span>50,000+ Happy Patients</span>
          </div>
          <div className="feature-item">
            <FaShieldAlt />
            <span>Secure Payments</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Unity Health Hub. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
