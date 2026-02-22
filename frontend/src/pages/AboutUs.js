import React from 'react';
import { FaHospital, FaBullseye, FaLightbulb, FaUsers, FaRocket, FaShieldAlt, FaMicrophone, FaRobot, FaComments, FaMobileAlt, FaLock } from 'react-icons/fa';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-header">
        <FaHospital className="about-icon" />
        <h1>🏥 About Us</h1>
        <p className="about-intro">
          Welcome to <strong>Unity Health Hub</strong>, a smart and accessible healthcare platform designed to make medical support easier, faster, and more reliable for everyone.
        </p>
        <p className="about-description">
          Our platform connects users with healthcare assistance through modern technology such as AI-powered consultation, voice-to-text interaction, and online medical guidance.
        </p>
      </div>

      <div className="about-content">
        {/* Mission Section */}
        <div className="about-section mission-section">
          <div className="section-icon">
            <FaBullseye />
          </div>
          <h2>🎯 Our Mission</h2>
          <p>
            Our mission is to make healthcare accessible to everyone, especially people in rural and remote areas who do not have easy access to hospitals or doctors.
          </p>
          <div className="mission-goals">
            <div className="goal-item">
              <span className="goal-icon">✓</span>
              <span>Provide instant medical guidance</span>
            </div>
            <div className="goal-item">
              <span className="goal-icon">✓</span>
              <span>Enable voice-based interaction for easy communication</span>
            </div>
            <div className="goal-item">
              <span className="goal-icon">✓</span>
              <span>Support users with quick health information</span>
            </div>
            <div className="goal-item">
              <span className="goal-icon">✓</span>
              <span>Reduce waiting time for basic consultations</span>
            </div>
          </div>
        </div>

        {/* What Makes Us Unique */}
        <div className="about-section unique-section">
          <div className="section-icon">
            <FaLightbulb />
          </div>
          <h2>💡 What Makes Us Unique?</h2>
          <div className="unique-features">
            <div className="feature-card">
              <FaMicrophone className="feature-icon" />
              <h3>Voice-Enabled Consultation</h3>
              <p>Speak your symptoms naturally and get instant responses</p>
            </div>
            <div className="feature-card">
              <FaRobot className="feature-icon" />
              <h3>AI-Powered Assistance</h3>
              <p>Intelligent health guidance powered by advanced AI</p>
            </div>
            <div className="feature-card">
              <FaComments className="feature-icon" />
              <h3>Real-Time Chat</h3>
              <p>Conversation history and instant medical advice</p>
            </div>
            <div className="feature-card">
              <FaMobileAlt className="feature-icon" />
              <h3>User-Friendly Interface</h3>
              <p>Simple and intuitive design for all age groups</p>
            </div>
            <div className="feature-card">
              <FaLock className="feature-icon" />
              <h3>Secure & Private</h3>
              <p>Your health data is protected and confidential</p>
            </div>
          </div>
        </div>

        {/* Who Can Use */}
        <div className="about-section users-section">
          <div className="section-icon">
            <FaUsers />
          </div>
          <h2>👨‍⚕️ Who Can Use This Platform?</h2>
          <p>Our healthcare platform is designed for:</p>
          <div className="user-types">
            <div className="user-type">
              <span className="user-icon">👥</span>
              <strong>Patients</strong> seeking quick medical advice
            </div>
            <div className="user-type">
              <span className="user-icon">👴</span>
              <strong>Elderly people</strong> who prefer voice interaction
            </div>
            <div className="user-type">
              <span className="user-icon">🏘️</span>
              <strong>Rural area users</strong> with limited hospital access
            </div>
            <div className="user-type">
              <span className="user-icon">💼</span>
              <strong>Students and professionals</strong> needing fast health guidance
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="about-section vision-section">
          <div className="section-icon">
            <FaRocket />
          </div>
          <h2>🚀 Our Vision</h2>
          <p>
            We believe technology can transform healthcare. Our vision is to create a digital healthcare ecosystem where medical support is just one click or one voice command away.
          </p>
          <div className="vision-highlight">
            <p>"Making healthcare accessible, affordable, and available to everyone, everywhere."</p>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="about-section privacy-section">
          <div className="section-icon">
            <FaShieldAlt />
          </div>
          <h2>🔒 Privacy & Security</h2>
          <p>
            We respect user privacy. All conversations and health information are securely handled and protected.
          </p>
          <div className="privacy-features">
            <div className="privacy-item">
              <FaLock />
              <span>End-to-end encryption</span>
            </div>
            <div className="privacy-item">
              <FaShieldAlt />
              <span>HIPAA compliant storage</span>
            </div>
            <div className="privacy-item">
              <FaLock />
              <span>Secure authentication</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about-footer">
        <h3>Join Us in Building a Healthier Future</h3>
        <p>Together, we can make healthcare accessible to everyone.</p>
      </div>
    </div>
  );
};

export default AboutUs;
