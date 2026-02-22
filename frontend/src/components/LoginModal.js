import React, { useState } from 'react';
import { FaUser, FaUserMd, FaUserTie, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [userType, setUserType] = useState('patient');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const userTypes = [
    { id: 'patient', label: 'Patient', icon: <FaUser />, color: '#3498db' },
    { id: 'doctor', label: 'Doctor', icon: <FaUserMd />, color: '#27ae60' },
    { id: 'staff', label: 'Staff', icon: <FaUserTie />, color: '#9b59b6' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Mock login - in production, this would call an API
    const user = {
      id: Date.now(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: userType
    };

    onLogin(user);
    onClose();
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>Select your role and {isLogin ? 'login' : 'sign up'}</p>
        </div>

        {/* User Type Selection */}
        <div className="user-type-selector">
          {userTypes.map((type) => (
            <button
              key={type.id}
              className={`user-type-btn ${userType === type.id ? 'active' : ''}`}
              onClick={() => setUserType(type.id)}
              style={{ '--type-color': type.color }}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="input-group">
            <label>Password *</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                required
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn">
            {isLogin ? `Login as ${userTypes.find(t => t.id === userType)?.label}` : `Sign Up as ${userTypes.find(t => t.id === userType)?.label}`}
          </button>

          <div className="switch-mode">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={switchMode}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </form>

        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Patient: patient@demo.com / password123</p>
          <p>Doctor: doctor@demo.com / password123</p>
          <p>Staff: staff@demo.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
