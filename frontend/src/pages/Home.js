import React from 'react';
import { FaSearch, FaCalendarCheck, FaShieldAlt, FaClock, FaUserMd, FaHospital, FaAmbulance, FaArrowRight, FaStar, FaCheckCircle } from 'react-icons/fa';
import './Home.css';

const Home = ({ onSearchClick, isLoggedIn }) => {
  // Extended specializations with more medical conditions for home page
  const specializations = [
    { name: 'Cardiologist', icon: '❤️', description: 'Heart, BP, Cardiac issues', count: '5 Doctors' },
    { name: 'Neurologist', icon: '🧠', description: 'Brain, Migraines, Epilepsy', count: '5 Doctors' },
    { name: 'Orthopedic', icon: '🦴', description: 'Bones, Joints, Fractures', count: '5 Doctors' },
    { name: 'Pediatrician', icon: '👶', description: 'Child Health, Vaccines', count: '5 Doctors' },
    { name: 'Dermatologist', icon: '🧴', description: 'Skin, Acne, Allergies', count: '5 Doctors' },
    { name: 'Ophthalmologist', icon: '👁️', description: 'Eye, Vision, Cataracts', count: '5 Doctors' },
    { name: 'Nephrologist', icon: '🫘', description: 'Kidney, Dialysis', count: '5 Doctors' },
    { name: 'Gastroenterologist', icon: '🍽️', description: 'Stomach, Liver, Digestion', count: '5 Doctors' },
    { name: 'Pulmonologist', icon: '🫁', description: 'Lungs, Asthma, TB', count: '5 Doctors' },
    { name: 'Endocrinologist', icon: '💉', description: 'Diabetes, Thyroid', count: '5 Doctors' },
    { name: 'Psychiatrist', icon: '🧘', description: 'Mental Health, Depression', count: '5 Doctors' },
    { name: 'Gynecologist', icon: '🌸', description: 'Women Health, Pregnancy', count: '5 Doctors' },
  ];

  const features = [
    {
      icon: <FaSearch />,
      title: 'Easy Search',
      description: 'Find doctors by specialization, location, or availability in seconds'
    },
    {
      icon: <FaCalendarCheck />,
      title: 'Instant Booking',
      description: 'Book appointments instantly with real-time slot availability'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with Razorpay integration'
    },
    {
      icon: <FaClock />,
      title: '24/7 Service',
      description: 'Access healthcare services anytime, anywhere'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      rating: 5,
      text: 'Amazing experience! Found the best cardiologist for my father within minutes. The booking process was smooth and the appointment was confirmed instantly.'
    },
    {
      name: 'Michael Chen',
      role: 'Patient',
      rating: 5,
      text: 'Unity Health Hub made it so easy to book an emergency appointment. The system quickly found an available slot and the doctor was very professional.'
    },
    {
      name: 'Emily Davis',
      role: 'Patient',
      rating: 5,
      text: 'Great platform! The interface is user-friendly and the payment process is secure. Highly recommend for all healthcare needs.'
    }
  ];

  const handleSpecializationClick = (specializationName) => {
    // Navigate to search with the specialization pre-selected
    if (onSearchClick) {
      onSearchClick();
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <FaAmbulance />
              <span>24/7 Emergency Care Available</span>
            </div>
            <h1 className="hero-title">
              Your Health is Our <span>Priority</span>
            </h1>
            <p className="hero-subtitle">
              Find the best doctors, book appointments instantly, and manage your healthcare journey 
              all in one place. Quality healthcare is just a click away.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-large" onClick={onSearchClick}>
                <FaSearch />
                Find a Doctor
                <FaArrowRight className="btn-icon" />
              </button>
              <button className="btn btn-outline btn-large">
                <FaUserMd />
                For Doctors
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Verified Doctors</span>
              </div>
              <div className="stat">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Happy Patients</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card card-1">
              <FaUserMd className="card-icon" />
              <div className="card-content">
                <h4>Expert Care</h4>
                <p>Top specialists</p>
              </div>
            </div>
            <div className="hero-card card-2">
              <FaHospital className="card-icon" />
              <div className="card-content">
                <h4>Quality Facilities</h4>
                <p>Best hospitals</p>
              </div>
            </div>
            <div className="hero-card card-3">
              <FaCalendarCheck className="card-icon" />
              <div className="card-content">
                <h4>Easy Booking</h4>
                <p>Instant confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2>Healthcare Made Simple</h2>
            <p>Experience the future of healthcare booking with our advanced platform</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="specializations">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Medical Specializations</span>
            <h2>Find the Right Specialist</h2>
            <p>Browse through our wide range of medical specializations - 5 doctors each</p>
          </div>
          <div className="specializations-grid">
            {specializations.map((spec, index) => (
              <div 
                key={index} 
                className="specialization-card" 
                onClick={() => handleSpecializationClick(spec.name)}
                style={{ cursor: 'pointer' }}
              >
                <span className="spec-icon">{spec.icon}</span>
                <h4>{spec.name}</h4>
                <span className="spec-description">{spec.description}</span>
                <span className="spec-count">{spec.count}</span>
              </div>
            ))}
          </div>
          <div className="specializations-cta">
            <button className="btn btn-primary" onClick={onSearchClick}>
              View All Specializations
              <FaArrowRight className="btn-icon" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Simple Process</span>
            <h2>How It Works</h2>
            <p>Book your appointment in just three easy steps</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">
                <FaSearch />
              </div>
              <h3>Search Doctor</h3>
              <p>Select your required specialization and search for doctors</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">
                <FaCalendarCheck />
              </div>
              <h3>Book Slot</h3>
              <p>Choose an available time slot that fits your schedule</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">
                <FaShieldAlt />
              </div>
              <h3>Pay & Confirm</h3>
              <p>Complete secure payment and get instant confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2>What Our Patients Say</h2>
            <p>Join thousands of satisfied patients who trust us</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
                <div className="testimonial-badge">
                  <FaCheckCircle />
                  <span>Verified Patient</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Book Your Appointment?</h2>
            <p>Take the first step towards better health. Find your doctor today.</p>
            <button className="btn btn-white btn-large" onClick={onSearchClick}>
              <FaSearch />
              Book Now
              <FaArrowRight className="btn-icon" />
            </button>
          </div>
          <div className="cta-decoration">
            <div className="cta-circle circle-1"></div>
            <div className="cta-circle circle-2"></div>
            <div className="cta-circle circle-3"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
