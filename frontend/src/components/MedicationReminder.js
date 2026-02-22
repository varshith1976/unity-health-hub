import React, { useState, useEffect, useCallback } from 'react';
import { FaClock, FaPills, FaCheck, FaBell, FaTimes, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { getTodaySchedule, recordDose } from '../services/api';
import './MedicationReminder.css';

const MedicationReminder = ({ isOpen, onClose }) => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [alarmSound, setAlarmSound] = useState(null);
  
  useEffect(() => {
    if (isOpen) {
      loadMedications();
      const interval = setInterval(loadMedications, 60000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && medications.length > 0) {
      checkAlarms();
      const alarmInterval = setInterval(checkAlarms, 60000);
      return () => clearInterval(alarmInterval);
    }
  }, [isOpen, medications]);

  const loadMedications = async () => {
    try {
      const response = await getTodaySchedule();
      if (response.data.success) {
        setMedications(response.data.data);
      }
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAlarms = useCallback(() => {
    const now = new Date();
    const currentTime = now.getTime();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    medications.forEach(med => {
      if (!med.scheduled_time) return;
      
      const [schedHour, schedMin] = med.scheduled_time.split(':').map(Number);
      const schedTime = schedHour * 60 + schedMin;
      const currentTimeInMins = currentHour * 60 + currentMinute;
      
      const timeDiff = currentTimeInMins - schedTime;
      
      if (timeDiff >= 0 && timeDiff <= 1 && med.dose_status === 'pending') {
        triggerAlarm(med, 'primary');
      } else if (timeDiff === -30 && med.dose_status === 'pending') {
        triggerAlarm(med, 'reminder');
      }
    });
  }, [medications]);

  const triggerAlarm = (med, type) => {
    const alarmData = {
      ...med,
      alarmType: type,
      message: type === 'primary' 
        ? `Time to take ${med.medicine_name}` 
        : `Reminder: ${med.medicine_name} in 30 minutes`
    };
    setActiveAlarm(alarmData);
    
    if (soundEnabled) {
      playAlarmSound();
    }
  };

  const playAlarmSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    
    let count = 0;
    const interval = setInterval(() => {
      count++;
      oscillator.frequency.value = count % 2 === 0 ? 800 : 600;
      if (count >= 10) {
        clearInterval(interval);
        oscillator.stop();
      }
    }, 500);
    
    setAlarmSound({ oscillator, gainNode });
  };

  const stopAlarm = () => {
    if (alarmSound) {
      alarmSound.oscillator.stop();
      setAlarmSound(null);
    }
    setActiveAlarm(null);
  };

  const handleMarkAsTaken = async (med) => {
    try {
      await recordDose({
        medication_id: med.id,
        scheduled_time: med.scheduled_time,
        status: 'taken',
        notes: 'Taken during medication reminder'
      });
      
      stopAlarm();
      loadMedications();
    } catch (error) {
      console.error('Error recording dose:', error);
    }
  };

  const handleSkipDose = async (med) => {
    try {
      await recordDose({
        medication_id: med.id,
        scheduled_time: med.scheduled_time,
        status: 'skipped',
        notes: 'Skipped by user'
      });
      
      stopAlarm();
      loadMedications();
    } catch (error) {
      console.error('Error skipping dose:', error);
    }
  };

  const groupMedicationsByTime = () => {
    const grouped = {
      morning: medications.filter(m => m.time_period === 'morning'),
      afternoon: medications.filter(m => m.time_period === 'afternoon'),
      evening: medications.filter(m => m.time_period === 'evening'),
      night: medications.filter(m => m.time_period === 'night')
    };
    return grouped;
  };

  const getTimePeriodLabel = (period) => {
    const labels = {
      morning: 'Morning (6 AM - 12 PM)',
      afternoon: 'Afternoon (12 PM - 5 PM)',
      evening: 'Evening (5 PM - 9 PM)',
      night: 'Night (9 PM - 12 AM)'
    };
    return labels[period] || period;
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <div className="medication-reminder-overlay">
      <div className="medication-reminder-modal">
        <div className="reminder-header">
          <h2><FaPills /> Medication Reminder</h2>
          <div className="reminder-controls">
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="coming-soon-container">
          <div className="coming-soon-icon">
            <FaPills size={80} />
          </div>
          <h2 className="coming-soon-title">Coming Soon!</h2>
          <p className="coming-soon-text">
            We're working hard to bring you an amazing medication reminder feature.
          </p>
          <p className="coming-soon-description">
            Soon you'll be able to:
          </p>
          <ul className="coming-soon-features">
            <li><FaCheck /> Set medication schedules</li>
            <li><FaCheck /> Get timely reminders</li>
            <li><FaCheck /> Track your medication adherence</li>
            <li><FaCheck /> View medication history</li>
            <li><FaCheck /> Sync with AI Doctor prescriptions</li>
          </ul>
          <p className="coming-soon-footer">
            Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicationReminder;
