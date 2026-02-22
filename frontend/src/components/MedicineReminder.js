import React, { useState, useEffect } from 'react';
import { FaBell, FaPlus, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './MedicineReminder.css';
import api from '../services/api';

const MedicineReminder = () => {
  const [schedule, setSchedule] = useState({ morning: [], afternoon: [], evening: [], night: [] });
  const [stats, setStats] = useState({ adherence_percentage: 0, taken_doses: 0, total_doses: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeReminder, setActiveReminder] = useState(null);

  useEffect(() => {
    fetchSchedule();
    fetchStats();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await api.get('/medications/schedule/today');
      if (response.data.success) {
        setSchedule(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/medications/adherence?days=7');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getTabletImage = (type) => {
    const images = {
      tablet: '💊',
      capsule: '💊',
      syrup: '🧪',
      injection: '💉',
      drops: '💧'
    };
    return images[type] || '💊';
  };

  const markAsTaken = async (medication) => {
    try {
      await api.post('/medications/dose', {
        medication_id: medication.id,
        scheduled_time: new Date(),
        status: 'taken'
      });
      fetchSchedule();
      fetchStats();
    } catch (error) {
      console.error('Error marking dose:', error);
    }
  };

  const renderMedicationCard = (med) => (
    <div key={med.id} className="medication-card">
      <div className="med-icon">{getTabletImage(med.dosage_type)}</div>
      <div className="med-details">
        <h4>{med.medicine_name}</h4>
        <p className="dosage">{med.dosage} - {med.quantity} {med.dosage_type}</p>
        <span className={`meal-badge ${med.meal_instruction}`}>
          {med.meal_instruction?.replace('_', ' ')}
        </span>
        <p className="time"><FaClock /> {med.scheduled_time}</p>
        <p className="days-left">{med.treatment_duration} days left</p>
      </div>
      {med.dose_status === 'pending' && (
        <button className="btn-take" onClick={() => markAsTaken(med)}>
          <FaCheckCircle /> Take
        </button>
      )}
      {med.dose_status === 'taken' && (
        <span className="status-taken"><FaCheckCircle /> Taken</span>
      )}
    </div>
  );

  return (
    <div className="medicine-reminder">
      <div className="reminder-header">
        <h2><FaBell /> Medicine Reminder</h2>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Add Medicine
        </button>
      </div>

      <div className="adherence-stats">
        <div className="stat-card">
          <h3>{stats.adherence_percentage || 0}%</h3>
          <p>Adherence Rate</p>
        </div>
        <div className="stat-card">
          <h3>{stats.taken_doses || 0}/{stats.total_doses || 0}</h3>
          <p>Doses This Week</p>
        </div>
      </div>

      <div className="schedule-grid">
        <div className="time-section morning">
          <h3>🌅 Morning (6 AM - 12 PM)</h3>
          <div className="medications-list">
            {schedule.morning?.length > 0 ? (
              schedule.morning.map(renderMedicationCard)
            ) : (
              <p className="no-meds">No medications scheduled</p>
            )}
          </div>
        </div>

        <div className="time-section afternoon">
          <h3>☀️ Afternoon (12 PM - 5 PM)</h3>
          <div className="medications-list">
            {schedule.afternoon?.length > 0 ? (
              schedule.afternoon.map(renderMedicationCard)
            ) : (
              <p className="no-meds">No medications scheduled</p>
            )}
          </div>
        </div>

        <div className="time-section evening">
          <h3>🌆 Evening (5 PM - 9 PM)</h3>
          <div className="medications-list">
            {schedule.evening?.length > 0 ? (
              schedule.evening.map(renderMedicationCard)
            ) : (
              <p className="no-meds">No medications scheduled</p>
            )}
          </div>
        </div>

        <div className="time-section night">
          <h3>🌙 Night (9 PM - 6 AM)</h3>
          <div className="medications-list">
            {schedule.night?.length > 0 ? (
              schedule.night.map(renderMedicationCard)
            ) : (
              <p className="no-meds">No medications scheduled</p>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddMedicationModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => { fetchSchedule(); setShowAddModal(false); }}
        />
      )}
    </div>
  );
};

const AddMedicationModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    medicine_name: '',
    dosage: '',
    dosage_type: 'tablet',
    quantity: 1,
    frequency: '',
    meal_instruction: 'after_food',
    start_date: new Date().toISOString().split('T')[0],
    treatment_duration: 7,
    schedules: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endDate = new Date(formData.start_date);
      endDate.setDate(endDate.getDate() + parseInt(formData.treatment_duration));
      
      await api.post('/medications', {
        ...formData,
        end_date: endDate.toISOString().split('T')[0]
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Add New Medication</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Medicine Name"
            value={formData.medicine_name}
            onChange={(e) => setFormData({...formData, medicine_name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Dosage (e.g., 500mg)"
            value={formData.dosage}
            onChange={(e) => setFormData({...formData, dosage: e.target.value})}
            required
          />
          <select
            value={formData.dosage_type}
            onChange={(e) => setFormData({...formData, dosage_type: e.target.value})}
          >
            <option value="tablet">Tablet</option>
            <option value="capsule">Capsule</option>
            <option value="syrup">Syrup</option>
            <option value="injection">Injection</option>
            <option value="drops">Drops</option>
          </select>
          <select
            value={formData.meal_instruction}
            onChange={(e) => setFormData({...formData, meal_instruction: e.target.value})}
          >
            <option value="before_food">Before Food</option>
            <option value="after_food">After Food</option>
            <option value="with_food">With Food</option>
            <option value="empty_stomach">Empty Stomach</option>
          </select>
          <input
            type="number"
            placeholder="Treatment Duration (days)"
            value={formData.treatment_duration}
            onChange={(e) => setFormData({...formData, treatment_duration: e.target.value})}
            required
          />
          <div className="modal-actions">
            <button type="submit" className="btn-primary">Add Medication</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineReminder;
