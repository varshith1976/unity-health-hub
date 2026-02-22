import React, { useState, useEffect } from 'react';
import './HospitalFinder.css';

const HospitalFinder = ({ latitude, longitude, specialization, onClose }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    fetchNearbyHospitals();
  }, []);

  const fetchNearbyHospitals = async () => {
    try {
      // Mock hospital data for demo
      const mockHospitals = [
        {
          id: 1,
          name: 'Apollo Hospital',
          address: '123 Medical District, Jubilee Hills',
          city: 'Hyderabad',
          phone: '+91-40-23607777',
          email: 'info@apollohyd.com',
          specializations: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
          rating: 4.7,
          emergency_available: true,
          bed_availability: 45,
          distance: 2.3,
          latitude: 17.4326,
          longitude: 78.4071
        },
        {
          id: 2,
          name: 'Fortis Hospital',
          address: '456 Healthcare Avenue, Banjara Hills',
          city: 'Hyderabad',
          phone: '+91-40-44446666',
          email: 'contact@fortishyd.com',
          specializations: ['Cardiology', 'Gastroenterology', 'Nephrology'],
          rating: 4.5,
          emergency_available: true,
          bed_availability: 32,
          distance: 3.1,
          latitude: 17.4239,
          longitude: 78.4738
        },
        {
          id: 3,
          name: 'KIMS Hospital',
          address: '789 Medical Road, Secunderabad',
          city: 'Hyderabad',
          phone: '+91-40-44885555',
          email: 'info@kimshospitals.com',
          specializations: ['Oncology', 'Neurology', 'Orthopedics'],
          rating: 4.6,
          emergency_available: true,
          bed_availability: 28,
          distance: 4.2,
          latitude: 17.4399,
          longitude: 78.4983
        },
        {
          id: 4,
          name: 'Care Hospital',
          address: '321 Health Street, Nampally',
          city: 'Hyderabad',
          phone: '+91-40-61651234',
          email: 'care@carehospitals.com',
          specializations: ['Cardiology', 'Pulmonology', 'Endocrinology'],
          rating: 4.4,
          emergency_available: true,
          bed_availability: 38,
          distance: 5.0,
          latitude: 17.3850,
          longitude: 78.4867
        },
        {
          id: 5,
          name: 'Yashoda Hospital',
          address: '654 Wellness Lane, Somajiguda',
          city: 'Hyderabad',
          phone: '+91-40-23554455',
          email: 'info@yashodahospitals.com',
          specializations: ['Gastroenterology', 'Nephrology', 'Urology'],
          rating: 4.5,
          emergency_available: true,
          bed_availability: 41,
          distance: 3.8,
          latitude: 17.4239,
          longitude: 78.4738
        }
      ];
      
      setHospitals(mockHospitals);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
      setLoading(false);
    }
  };

  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleCreateReferral = async () => {
    if (!selectedHospital) return;
    alert(`Referral created for ${selectedHospital.name}`);
    if (onClose) onClose();
  };

  const openInMaps = (hospital) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="hospital-finder-container">
        <div className="loading">🔍 Finding nearby hospitals...</div>
      </div>
    );
  }

  return (
    <div className="hospital-finder-container">
      <div className="finder-header">
        <h2>🏥 Nearby Hospitals</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {hospitals.length === 0 ? (
        <div className="no-hospitals">
          <p>No hospitals found nearby. Please try expanding your search area.</p>
        </div>
      ) : (
        <div className="hospitals-list">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className={`hospital-card ${selectedHospital?.id === hospital.id ? 'selected' : ''}`}
              onClick={() => handleSelectHospital(hospital)}
            >
              <div className="hospital-header">
                <h3>{hospital.name}</h3>
                <div className="hospital-rating">
                  ⭐ {hospital.rating.toFixed(1)}
                </div>
              </div>

              <div className="hospital-details">
                <p className="address">📍 {hospital.address}</p>
                <p className="distance">🚗 {hospital.distance?.toFixed(1)} km away</p>
                <p className="phone">📞 {hospital.phone}</p>
              </div>

              <div className="hospital-specializations">
                {hospital.specializations?.slice(0, 3).map((spec, idx) => (
                  <span key={idx} className="spec-badge">{spec}</span>
                ))}
              </div>

              <div className="hospital-availability">
                {hospital.emergency_available && (
                  <span className="emergency-badge">🚨 Emergency Available</span>
                )}
                {hospital.bed_availability > 0 && (
                  <span className="beds-badge">🛏️ {hospital.bed_availability} beds</span>
                )}
              </div>

              <div className="hospital-actions">
                <button
                  className="btn-map"
                  onClick={(e) => {
                    e.stopPropagation();
                    openInMaps(hospital);
                  }}
                >
                  📍 View on Map
                </button>
                <button
                  className="btn-call"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${hospital.phone}`;
                  }}
                >
                  📞 Call Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedHospital && (
        <div className="referral-actions">
          <button className="btn-create-referral" onClick={handleCreateReferral}>
            Create Referral to {selectedHospital.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default HospitalFinder;
