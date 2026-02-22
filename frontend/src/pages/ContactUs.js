import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaHeart, FaPaperPlane } from 'react-icons/fa';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you can add API call to save the message
    console.log('Contact form submitted:', formData);
    
    // Show success message
    setSubmitted(true);
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      message: ''
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-us-container">
      <div className="contact-header">
        <h1>📞 Contact Us</h1>
        <p>We'd love to hear from you! If you have any questions, feedback, or need support, feel free to reach out to us anytime.</p>
        <p>Our team is always ready to help you and improve your healthcare experience.</p>
      </div>

      <div className="contact-content">
        {/* Contact Information */}
        <div className="contact-info-section">
          <h2>📨 Get in Touch</h2>
          
          <div className="contact-info-cards">
            <div className="info-card">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div className="info-details">
                <h3>Email</h3>
                <p>support@unityhealthhub.com</p>
                <small>We'll respond within 24 hours</small>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaPhone />
              </div>
              <div className="info-details">
                <h3>Phone</h3>
                <p>+91 9550258825</p>
                <small>Mon-Sat: 9 AM - 6 PM</small>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="info-details">
                <h3>Location</h3>
                <p>India</p>
                <small>(You can replace these with your real details later.)</small>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div className="support-hours">
            <h3><FaClock /> Support Hours</h3>
            <div className="hours-grid">
              <div className="hours-item">
                <strong>Monday – Saturday</strong>
                <span>9:00 AM – 6:00 PM</span>
              </div>
              <div className="hours-item emergency">
                <strong>Emergency Support</strong>
                <span>Available 24/7 through our platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>📝 Send Us a Message</h2>
          <p>You can also contact us by filling out the form below:</p>

          {submitted && (
            <div className="success-message">
              <FaPaperPlane />
              <p>Thank you! Your message has been sent successfully.</p>
              <small>We'll get back to you within 24 hours.</small>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXXXXXXX"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                rows="6"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              <FaPaperPlane />
              Submit
            </button>
            <p className="form-note">👉 Click Submit, and our team will get back to you as soon as possible.</p>
          </form>
        </div>
      </div>

      {/* Care Message */}
      <div className="care-message">
        <FaHeart className="heart-icon" />
        <h2>💙 We Care About You</h2>
        <p>Your health matters to us. Thank you for trusting our platform.</p>
        <p>Together, let's build a healthier future.</p>
      </div>
    </div>
  );
};

export default ContactUs;
