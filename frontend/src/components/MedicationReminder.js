import React, { useState, useEffect, useRef } from 'react';
import { FaPills, FaCheck, FaTimes, FaClock, FaBell, FaTrash, FaPlus, FaPlay, FaPause } from 'react-icons/fa';
import './MedicationReminder.css';

const STORAGE_KEY = 'healthcare_medications';

const TIME_SLOTS = {
  morning: { label: 'Morning', icon: '🌅', range: '6 AM – 12 PM' },
  afternoon: { label: 'Afternoon', icon: '☀️', range: '12 PM – 5 PM' },
  evening: { label: 'Evening', icon: '🌇', range: '5 PM – 9 PM' },
  night: { label: 'Night', icon: '🌙', range: '9 PM – 6 AM' }
};

function getTimeSlot(time) {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function formatTime(time) {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

const MedicationReminder = ({ isOpen, onClose }) => {
  const [medications, setMedications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    times: ['08:00'],
    durationDays: 7,
    mealInstruction: 'after-food'
  });
  
  // Alarm state
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [alarmSound, setAlarmSound] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const alarmCheckRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadMedications();
      startAlarmChecker();
    } else {
      stopAlarmChecker();
    }
    
    return () => stopAlarmChecker();
  }, [isOpen]);

  const loadMedications = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMedications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  const saveMedications = (meds) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meds));
      setMedications(meds);
    } catch (error) {
      console.error('Error saving medications:', error);
    }
  };

  // Alarm checker - runs every 30 seconds
  const startAlarmChecker = () => {
    checkAlarms();
    alarmCheckRef.current = setInterval(checkAlarms, 30000);
  };

  const stopAlarmChecker = () => {
    if (alarmCheckRef.current) {
      clearInterval(alarmCheckRef.current);
    }
    stopAlarmSound();
  };

  const checkAlarms = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMins = currentHour * 60 + currentMinute;

    medications.forEach(med => {
      if (med.status === 'taken') return;
      
      med.times.forEach(time => {
        const [schedHour, schedMin] = time.split(':').map(Number);
        const schedTimeInMins = schedHour * 60 + schedMin;
        
        // Check if current time matches scheduled time (within 1 minute window)
        const timeDiff = Math.abs(currentTimeInMins - schedTimeInMins);
        
        if (timeDiff <= 1) {
          triggerAlarm(med, time);
        }
      });
    });
  };

  const triggerAlarm = (med, time) => {
    // Don't trigger if already shown in last 5 minutes
    const lastAlarm = localStorage.getItem('last_alarm_' + med.id + '_' + time);
    const now = new Date().getTime();
    
    if (lastAlarm && (now - parseInt(lastAlarm)) < 5 * 60 * 1000) {
      return;
    }
    
    localStorage.setItem('last_alarm_' + med.id + '_' + time, now.toString());
    
    const alarmData = {
      ...med,
      scheduledTime: time,
      message: `Time to take ${med.name} - ${med.dosage}`
    };
    
    setActiveAlarm(alarmData);
    
    if (soundEnabled) {
      playAlarmSound();
    }
  };

  const playAlarmSound = () => {
    try {
      // Create beep sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const playBeep = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 880;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        
        // Beep pattern: 3 beeps
        let count = 0;
        const interval = setInterval(() => {
          count++;
          oscillator.frequency.value = count % 2 === 0 ? 880 : 660;
          if (count >= 6) {
            clearInterval(interval);
            oscillator.stop();
          }
        }, 300);
      };
      
      playBeep();
      
      // Repeat alarm 3 times
      let repeatCount = 0;
      const repeatInterval = setInterval(() => {
        repeatCount++;
        if (repeatCount >= 3) {
          clearInterval(repeatInterval);
        } else {
          setTimeout(playBeep, 2000);
        }
      }, 2500);
      
      setAlarmSound({ audioContext, interval: repeatInterval });
    } catch (error) {
      console.log('Error playing alarm:', error);
    }
  };

  const stopAlarmSound = () => {
    if (alarmSound) {
      if (alarmSound.interval) {
        clearInterval(alarmSound.interval);
      }
      if (alarmSound.audioContext) {
        alarmSound.audioContext.close();
      }
      setAlarmSound(null);
    }
  };

  const dismissAlarm = () => {
    stopAlarmSound();
    setActiveAlarm(null);
  };

  const snoozeAlarm = (minutes = 10) => {
    stopAlarmSound();
    // Re-trigger alarm after snooze time
    setTimeout(() => {
      if (activeAlarm) {
        triggerAlarm(activeAlarm, activeAlarm.scheduledTime);
      }
    }, minutes * 60 * 1000);
    setActiveAlarm(null);
  };

  const addMedication = () => {
    if (!newMed.name.trim()) return;
    
    const med = {
      id: Date.now().toString(),
      name: newMed.name,
      dosage: newMed.dosage || 'As directed',
      times: newMed.times,
      durationDays: newMed.durationDays,
      mealInstruction: newMed.mealInstruction,
      startDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    const updated = [...medications, med];
    saveMedications(updated);
    setShowAddForm(false);
    setNewMed({
      name: '',
      dosage: '',
      times: ['08:00'],
      durationDays: 7,
      mealInstruction: 'after-food'
    });
  };

  const removeMedication = (id) => {
    const updated = medications.filter(m => m.id !== id);
    saveMedications(updated);
  };

  const markAsTaken = (id) => {
    const updated = medications.map(m => 
      m.id === id ? { ...m, status: 'taken', takenAt: new Date().toISOString() } : m
    );
    saveMedications(updated);
  };

  const getRemainingDays = (startDate, durationDays) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + durationDays);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const groupMedicationsByTime = () => {
    const grouped = { morning: [], afternoon: [], evening: [], night: [] };
    medications.forEach(med => {
      med.times.forEach(time => {
        const slot = getTimeSlot(time);
        grouped[slot].push({ ...med, time });
      });
    });
    return grouped;
  };

  const addTimeSlot = () => {
    setNewMed({
      ...newMed,
      times: [...newMed.times, '12:00']
    });
  };

  const removeTimeSlot = (index) => {
    const newTimes = newMed.times.filter((_, i) => i !== index);
    setNewMed({
      ...newMed,
      times: newTimes.length > 0 ? newTimes : ['08:00']
    });
  };

  const updateTimeSlot = (index, value) => {
    const newTimes = [...newMed.times];
    newTimes[index] = value;
    setNewMed({
      ...newMed,
      times: newTimes
    });
  };

  const filteredMedications = activeTab === 'all' 
    ? medications 
    : medications.filter(m => m.status === activeTab);

  const grouped = groupMedicationsByTime();

  if (!isOpen) return null;

  return (
    <>
      <div className="medication-reminder-overlay">
        <div className="medication-reminder-modal">
          <div className="reminder-header">
            <h2><FaPills /> Medication Reminder</h2>
            <div className="reminder-controls">
              <button 
                className={`sound-toggle ${soundEnabled ? 'active' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              >
                {soundEnabled ? <FaBell /> : <FaPause />}
              </button>
              <button className="close-btn" onClick={onClose}>
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="reminder-tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({medications.length})
            </button>
            <button 
              className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({medications.filter(m => m.status === 'pending').length})
            </button>
            <button 
              className={`tab ${activeTab === 'taken' ? 'active' : ''}`}
              onClick={() => setActiveTab('taken')}
            >
              Taken ({medications.filter(m => m.status === 'taken').length})
            </button>
          </div>

          <div className="reminder-content">
            {medications.length === 0 ? (
              <div className="empty-state">
                <FaPills size={60} />
                <h3>No Medications</h3>
                <p>Your prescriptions from AI Doctor will appear here</p>
                <button className="btn-primary" onClick={() => setShowAddForm(true)}>
                  <FaPlus /> Add Medication
                </button>
              </div>
            ) : (
              <>
                {Object.entries(TIME_SLOTS).map(([slot, config]) => {
                  const slotMeds = grouped[slot];
                  if (slotMeds.length === 0) return null;
                  
                  return (
                    <div key={slot} className="time-slot-section">
                      <h3 className="slot-header">
                        <span>{config.icon}</span> {config.label} ({config.range})
                      </h3>
                      <div className="medications-list">
                        {slotMeds.map(med => (
                          <div key={`${med.id}-${med.time}`} className={`medication-card ${med.status}`}>
                            <div className="med-info">
                              <h4>{med.name}</h4>
                              <p className="dosage">{med.dosage}</p>
                              <p className="time"><FaClock /> {formatTime(med.time)}</p>
                              <p className="duration">
                                {getRemainingDays(med.startDate, med.durationDays)} days remaining
                              </p>
                            </div>
                            <div className="med-actions">
                              {med.status === 'pending' ? (
                                <button 
                                  className="take-btn"
                                  onClick={() => markAsTaken(med.id)}
                                >
                                  <FaCheck /> Take
                                </button>
                              ) : (
                                <span className="taken-badge"><FaCheck /> Taken</span>
                              )}
                              <button 
                                className="delete-btn"
                                onClick={() => removeMedication(med.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className="reminder-footer">
            <button className="add-med-btn" onClick={() => setShowAddForm(true)}>
              <FaPlus /> Add Medication
            </button>
          </div>
        </div>
      </div>

      {/* Alarm Popup */}
      {activeAlarm && (
        <div className="alarm-overlay">
          <div className="alarm-popup">
            <div className="alarm-content">
              <div className="alarm-icon">
                <FaBell />
              </div>
              <h3>⏰ Time for Medicine!</h3>
              <p className="alarm-med-name">{activeAlarm.name}</p>
              <p className="alarm-dosage">{activeAlarm.dosage}</p>
              <p className="alarm-time">Scheduled: {formatTime(activeAlarm.scheduledTime)}</p>
              
              <div className="alarm-actions">
                <button className="btn-take" onClick={() => {
                  markAsTaken(activeAlarm.id);
                  dismissAlarm();
                }}>
                  <FaCheck /> Mark as Taken
                </button>
                <button className="btn-snooze" onClick={() => snoozeAlarm(10)}>
                  <FaClock /> Snooze 10 min
                </button>
              </div>
              
              <button className="btn-dismiss" onClick={dismissAlarm}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="add-form-overlay">
          <div className="add-form">
            <h3>Add Medication</h3>
            <input
              type="text"
              placeholder="Medicine Name"
              value={newMed.name}
              onChange={(e) => setNewMed({...newMed, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Dosage (e.g., 500mg)"
              value={newMed.dosage}
              onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
            />
            
            <div className="times-section">
              <label>Times:</label>
              {newMed.times.map((time, index) => (
                <div key={index} className="time-input-row">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                  />
                  {newMed.times.length > 1 && (
                    <button 
                      className="remove-time-btn"
                      onClick={() => removeTimeSlot(index)}
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
              <button className="add-time-btn" onClick={addTimeSlot}>
                <FaPlus /> Add Time
              </button>
            </div>
            
            <select
              value={newMed.mealInstruction}
              onChange={(e) => setNewMed({...newMed, mealInstruction: e.target.value})}
            >
              <option value="before-food">Before Food</option>
              <option value="after-food">After Food</option>
              <option value="with-food">With Food</option>
              <option value="any">Any Time</option>
            </select>
            <input
              type="number"
              placeholder="Duration (days)"
              value={newMed.durationDays}
              onChange={(e) => setNewMed({...newMed, durationDays: parseInt(e.target.value) || 7})}
            />
            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={addMedication}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicationReminder;
