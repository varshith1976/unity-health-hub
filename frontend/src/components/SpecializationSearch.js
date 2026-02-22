import React, { useState } from 'react';
import { FaSearch, FaStethoscope } from 'react-icons/fa';
import './SpecializationSearch.css';

const SpecializationSearch = ({ onDoctorsFound }) => {
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [filters, setFilters] = useState({
    minExperience: '',
    maxFee: '',
    minRating: '',
    availability: ''
  });
  const [loading, setLoading] = useState(false);

  // 30 Specializations
  const specializations = [
    { name: 'Cardiologist', description: 'Heart specialist', icon: '❤️' },
    { name: 'Nephrologist', description: 'Kidney specialist', icon: '🫘' },
    { name: 'Ophthalmologist', description: 'Eye specialist', icon: '👁️' },
    { name: 'Dermatologist', description: 'Skin specialist', icon: '🧴' },
    { name: 'Neurologist', description: 'Brain & nervous system', icon: '🧠' },
    { name: 'Orthopedic Surgeon', description: 'Bones & joints', icon: '🦴' },
    { name: 'Pediatrician', description: 'Children specialist', icon: '👶' },
    { name: 'General Physician', description: 'Primary care', icon: '🩺' },
    { name: 'Gastroenterologist', description: 'Digestive system', icon: '🍽️' },
    { name: 'Pulmonologist', description: 'Lungs & respiratory', icon: '🫁' },
    { name: 'Endocrinologist', description: 'Hormone & metabolic', icon: '💉' },
    { name: 'Psychiatrist', description: 'Mental health', icon: '🧘' },
    { name: 'Gynecologist', description: 'Women health', icon: '🌸' },
    { name: 'Urologist', description: 'Urinary system', icon: '🔬' },
    { name: 'ENT Specialist', description: 'Ear, nose & throat', icon: '👂' },
    { name: 'Dentist', description: 'Dental care', icon: '🦷' },
    { name: 'Oncologist', description: 'Cancer treatment', icon: '🎗️' },
    { name: 'Rheumatologist', description: 'Arthritis & joints', icon: '🦿' },
    { name: 'Hepatologist', description: 'Liver specialist', icon: '🫘' },
    { name: 'Vascular Surgeon', description: 'Blood vessels', icon: '💗' },
    { name: 'Plastic Surgeon', description: 'Cosmetic surgery', icon: '✨' },
    { name: 'Neonatologist', description: 'Newborn care', icon: '🌟' },
    { name: 'Geriatrician', description: 'Elderly care', icon: '👴' },
    { name: 'Allergist', description: 'Allergies', icon: '🤧' },
    { name: 'Sports Medicine', description: 'Sports injuries', icon: '⚽' },
    { name: 'Pain Specialist', description: 'Pain management', icon: '💊' },
    { name: 'Nutritionist', description: 'Diet & nutrition', icon: '🥗' },
    { name: 'Pathologist', description: 'Disease diagnosis', icon: '🔬' },
    { name: 'Radiologist', description: 'Imaging & scans', icon: '📷' },
    { name: 'Anesthesiologist', description: 'Anesthesia', icon: '💉' }
  ];

  // Generate 10 doctors for selected specialization
  const generate10Doctors = (specialization) => {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Anita', 'Sanjay', 'Kavita', 'Rahul', 'Meera'];
    const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Joshi', 'Reddy', 'Gupta', 'Verma', 'Rao', 'Agarwal'];
    const hospitals = [
      'Unity Health Hub Hospital',
      'City Medical Center',
      'Premium Health Clinic',
      'Wellness Hospital',
      'Care & Cure Medical',
      'Apollo Healthcare',
      'MediCare Plus',
      'LifeLine Hospital',
      'HealthFirst Clinic',
      'Metro Medical Center'
    ];

    const doctors = [];
    for (let i = 0; i < 10; i++) {
      doctors.push({
        id: `doctor-${i + 1}`,
        full_name: `Dr. ${firstNames[i]} ${lastNames[i]}`,
        specialization: specialization,
        qualifications: i < 3 ? 'MD, DM' : i < 6 ? 'MD, DNB' : 'MBBS, MD',
        experience_years: 5 + (i * 2),
        consultation_fee: 300 + (i * 50),
        rating: (4.0 + (i * 0.05)).toFixed(1),
        total_reviews: 50 + (i * 25),
        hospital_name: hospitals[i],
        hospital_address: `${100 + i * 10}, Health Street, Medical City`,
        isAvailable: true
      });
    }
    return doctors;
  };

  // Apply filters to doctors
  const applyFilters = (doctors) => {
    let filtered = [...doctors];

    // Filter by minimum experience
    if (filters.minExperience) {
      filtered = filtered.filter(doc => doc.experience_years >= parseInt(filters.minExperience));
    }

    // Filter by maximum fee
    if (filters.maxFee) {
      filtered = filtered.filter(doc => doc.consultation_fee <= parseFloat(filters.maxFee));
    }

    // Filter by minimum rating
    if (filters.minRating) {
      filtered = filtered.filter(doc => parseFloat(doc.rating) >= parseFloat(filters.minRating));
    }

    // Filter by availability (for demo, all are available)
    if (filters.availability === 'today') {
      // All doctors are available today in demo
      filtered = filtered.filter(doc => doc.isAvailable);
    }

    return filtered;
  };

  const handleSearch = () => {
    if (!selectedSpecialization) {
      alert('Please select a specialization');
      return;
    }

    setLoading(true);
    
    // Generate 10 doctors and apply filters
    setTimeout(() => {
      const allDoctors = generate10Doctors(selectedSpecialization);
      const filteredDoctors = applyFilters(allDoctors);
      
      console.log('✅ Generated 10 doctors for:', selectedSpecialization);
      console.log('Applied filters:', filters);
      console.log('Filtered doctors:', filteredDoctors.length);
      
      onDoctorsFound(filteredDoctors);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <FaStethoscope className="header-icon" />
        <h2>Find Your Doctor</h2>
        <p>Search by medical specialization and find the best doctors</p>
      </div>

      <div className="search-form">
        <div className="input-group">
          <label>Select Specialization *</label>
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="specialization-select"
          >
            <option value="">Choose a specialization...</option>
            {specializations.map((spec, index) => (
              <option key={index} value={spec.name}>
                {spec.icon} {spec.name} - {spec.description}
              </option>
            ))}
          </select>
        </div>

        <div className="filters-grid">
          <div className="input-group">
            <label>Min Experience (years)</label>
            <input
              type="number"
              placeholder="e.g., 5"
              value={filters.minExperience}
              onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label>Max Fee (₹)</label>
            <input
              type="number"
              placeholder="e.g., 1000"
              value={filters.maxFee}
              onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label>Min Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
            >
              <option value="">Any</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>

          <div className="input-group">
            <label>Availability</label>
            <select
              value={filters.availability}
              onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
            >
              <option value="">Any Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>

        <button 
          className="btn btn-primary search-btn" 
          onClick={handleSearch} 
          disabled={loading}
        >
          <FaSearch />
          {loading ? 'Searching...' : 'Search Doctors'}
        </button>
      </div>
    </div>
  );
};

export default SpecializationSearch;
