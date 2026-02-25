import React, { useState, useEffect } from 'react';
import { FaPills, FaHistory, FaPlus, FaTimes, FaCheck, FaTablets } from 'react-icons/fa';
import './PatientDashboard.css';

const PatientDashboard = ({ patientId, onNavigateToMedicines }) => {
  const [activeTab, setActiveTab] = useState('consultations');
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    tabletName: '',
    quantity: 1,
    dose: '',
    frequency: '1-0-1',
    duration: '5 days',
    amount: 0,
    totalAmount: 0
  });

  // Medicine reminder list
  const [medicineReminders, setMedicineReminders] = useState([]);

  useEffect(() => {
    fetchConsultations();
    loadMedicineReminders();
  }, [patientId]);

  const loadMedicineReminders = () => {
    const stored = localStorage.getItem('medicineReminders');
    if (stored) {
      setMedicineReminders(JSON.parse(stored));
    }
  };

  const fetchConsultations = async () => {
    try {
      const storedConsultations = localStorage.getItem('consultationHistory');
      let loadedConsultations = [];
      
      if (storedConsultations) {
        loadedConsultations = JSON.parse(storedConsultations);
      }
      
      if (loadedConsultations.length === 0) {
        loadedConsultations = [
          {
            id: 1,
            date: new Date().toISOString().split('T')[0],
            doctorName: 'Dr. Sharma',
            specialization: 'General Physician',
            type: 'video',
            status: 'completed',
            duration: 25
          },
          {
            id: 2,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            doctorName: 'Dr. Patel',
            specialization: 'Cardiologist',
            type: 'audio',
            status: 'completed',
            duration: 18
          }
        ];
      }
      
      setConsultations(loadedConsultations);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
      setLoading(false);
    }
  };

  const viewConsultationDetails = async (consultation) => {
    setSelectedConsultation(consultation);
    
    let loadedTranscripts = [];
    
    if (consultation.transcript && consultation.transcript.length > 0) {
      loadedTranscripts = consultation.transcript.map(t => ({
        id: t.id,
        speaker: t.speaker,
        transcript_text: t.text,
        timestamp: t.timestamp
      }));
    } else {
      loadedTranscripts = [
        {
          id: 1,
          speaker: 'patient',
          transcript_text: 'I have been experiencing fever and cough for the past 3 days.',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          speaker: 'ai',
          transcript_text: 'How high is your fever? Have you measured your temperature?',
          timestamp: new Date().toISOString()
        },
        {
          id: 3,
          speaker: 'patient',
          transcript_text: 'It was around 101°F this morning. I also feel very tired.',
          timestamp: new Date().toISOString()
        },
        {
          id: 4,
          speaker: 'ai',
          transcript_text: 'I see. Any difficulty breathing or chest pain?',
          timestamp: new Date().toISOString()
        },
        {
          id: 5,
          speaker: 'patient',
          transcript_text: 'No chest pain, but I do feel a bit breathless sometimes.',
          timestamp: new Date().toISOString()
        }
      ];
    }
    setTranscripts(loadedTranscripts);

    let loadedAnalysis = null;
    if (consultation.aiAnalysis) {
      loadedAnalysis = consultation.aiAnalysis;
    } else {
      loadedAnalysis = {
        symptoms_identified: ['fever', 'cough', 'fatigue', 'shortness of breath'],
        severity_level: 'moderate',
        risk_factors: [],
        suggested_diagnosis: ['Upper Respiratory Tract Infection', 'Viral Fever'],
        medication_recommendations: ['Paracetamol 500mg (as needed)', 'Cough syrup', 'Rest and hydration'],
        red_flags: [],
        requires_physical_exam: false,
        requires_emergency_care: false
      };
    }
    setAnalysis(loadedAnalysis);
  };

  const closeDetails = () => {
    setSelectedConsultation(null);
    setAnalysis(null);
    setTranscripts([]);
  };

  // Generate prescription based on medication and specialization
  const generatePrescription = (medication) => {
    const specialization = selectedConsultation?.specialization || 'General Physician';
    const medicationLower = medication.toLowerCase();
    
    // Base price per unit
    let basePrice = 2;
    
    // Adjust based on medication type
    if (medicationLower.includes('paracetamol') || medicationLower.includes('acetaminophen')) {
      basePrice = 1.5;
    } else if (medicationLower.includes('antibiotic') || medicationLower.includes('amoxicillin')) {
      basePrice = 5;
    } else if (medicationLower.includes('cough') || medicationLower.includes('syrup')) {
      basePrice = 3;
    } else if (medicationLower.includes('diabetes') || medicationLower.includes('metformin')) {
      basePrice = 3;
    } else if (medicationLower.includes('blood pressure') || medicationLower.includes('hypertension')) {
      basePrice = 4;
    } else if (medicationLower.includes('heart') || medicationLower.includes('cardio')) {
      basePrice = 8;
    }
    
    // Calculate dose
    let dose = '500mg';
    if (medicationLower.includes('250')) dose = '250mg';
    else if (medicationLower.includes('650')) dose = '650mg';
    else if (medicationLower.includes('1000') || medicationLower.includes('1g')) dose = '1000mg';
    
    // Default quantity based on duration
    const quantity = 10;
    const totalAmount = basePrice * quantity;
    
    
    setPrescriptionForm({
      tabletName: medication,
      quantity: quantity,
      dose: dose,
      frequency: '1-0-1',
      duration: '5 days',
      amount: basePrice,
      totalAmount: totalAmount
    });
    setShowPrescriptionModal(true);
  };

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...prescriptionForm, [name]: value };
    
    // Recalculate total when quantity or amount changes
    if (name === 'quantity' || name === 'amount') {
      updated.totalAmount = parseFloat(updated.quantity) * parseFloat(updated.amount || 0);
    }
    
    setPrescriptionForm(updated);
  };

  const saveToMedicineReminder = () => {
    const reminder = {
      id: Date.now(),
      tabletName: prescriptionForm.tabletName,
      quantity: prescriptionForm.quantity,
      dose: prescriptionForm.dose,
      frequency: prescriptionForm.frequency,
      duration: prescriptionForm.duration,
      amount: prescriptionForm.amount,
      totalAmount: prescriptionForm.totalAmount,
      consultationId: selectedConsultation?.id,
      doctorName: selectedConsultation?.doctorName,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      status: 'pending'
    };
    
    const updatedReminders = [...medicineReminders, reminder];
    setMedicineReminders(updatedReminders);
    localStorage.setItem('medicineReminders', JSON.stringify(updatedReminders));
    
    setShowPrescriptionModal(false);
    alert('Medicine added to reminder successfully!');
  };

  const deleteReminder = (id) => {
    const updated = medicineReminders.filter(r => r.id !== id);
    setMedicineReminders(updated);
    localStorage.setItem('medicineReminders', JSON.stringify(updated));
  };

  const toggleReminderStatus = (id) => {
    const updated = medicineReminders.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === 'pending' ? 'taken' : 'pending' };
      }
      return r;
    });
    setMedicineReminders(updated);
    localStorage.setItem('medicineReminders', JSON.stringify(updated));
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your consultations...</div>;
  }

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <h2>Patient Dashboard</h2>
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'consultations' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            <FaHistory /> Consultations
          </button>
        </div>
      </div>

      {activeTab === 'consultations' && (
        <>
          <div className="consultations-grid">
            {consultations.map((consultation) => (
              <div key={consultation.id} className="consultation-card">
                <div className="consultation-header">
                  <span className="consultation-type">
                    {consultation.type === 'video' ? 'Video' : 'Audio'} Consultation
                  </span>
                  <span className="consultation-status">{consultation.status}</span>
                </div>
                
                <div className="consultation-info">
                  <h3>{consultation.doctorName}</h3>
                  <p className="consultation-date">{consultation.date}</p>
                  <p className="consultation-duration">{consultation.duration || 0} minutes</p>
                  {consultation.rating && (
                    <p className="consultation-rating">Rating: {consultation.rating}/5</p>
                  )}
                </div>

                <button
                  className="btn-view-details"
                  onClick={() => viewConsultationDetails(consultation)}
                >
                  View Details & Transcript
                </button>
              </div>
            ))}
          </div>

          {consultations.length === 0 && (
            <div className="no-consultations">
              <p>No consultations yet. Book your first appointment!</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'medicines' && (
        <div className="medicine-reminder-section">
          <h3>Medicine Reminder</h3>
          {medicineReminders.length === 0 ? (
            <div className="no-medicines">
              <FaPills style={{ fontSize: '3rem', opacity: 0.3 }} />
              <p>No medicine reminders yet. Add medicines from your consultation details.</p>
            </div>
          ) : (
            <div className="medicine-list">
              {medicineReminders.map((reminder) => (
                <div key={reminder.id} className={`medicine-card ${reminder.status}`}>
                  <div className="medicine-info">
                    <h4>{reminder.tabletName}</h4>
                    <p>Dose: {reminder.dose} | Qty: {reminder.quantity}</p>
                    <p>Frequency: {reminder.frequency} | Duration: {reminder.duration}</p>
                    <p className="medicine-amount">Total: ₹{reminder.totalAmount}</p>
                    <p className="medicine-meta">Dr. {reminder.doctorName} | {reminder.date}</p>
                  </div>
                  <div className="medicine-actions">
                    <button 
                      className={`btn-toggle ${reminder.status}`}
                      onClick={() => toggleReminderStatus(reminder.id)}
                    >
                      {reminder.status === 'pending' ? <FaCheck /> : 'Undo'}
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedConsultation && (
        <div className="details-modal">
          <div className="details-content">
            <div className="details-header">
              <h2>Consultation Details</h2>
              <button className="close-btn" onClick={closeDetails}>X</button>
            </div>

            <div className="details-section">
              <h3>Consultation Transcript</h3>
              <div className="transcript-list">
                {transcripts.map((t, idx) => (
                  <div key={idx} className="transcript-entry">
                    <span className="speaker-label">{t.speaker}:</span>
                    <span className="transcript-text">{t.transcript_text}</span>
                  </div>
                ))}
              </div>
            </div>

            {analysis && (
              <>
                <div className="details-section">
                  <h3>AI Clinical Analysis</h3>
                  
                  <div className="analysis-grid">
                    <div className="analysis-item">
                      <h4>Symptoms Identified:</h4>
                      <ul>
                        {analysis.symptoms_identified?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="analysis-item">
                      <h4>Severity Level:</h4>
                      <span className={`severity-tag ${analysis.severity_level}`}>
                        {analysis.severity_level}
                      </span>
                    </div>

                    <div className="analysis-item">
                      <h4>Risk Factors:</h4>
                      <ul>
                        {analysis.risk_factors?.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="analysis-item">
                      <h4>Suggested Diagnosis:</h4>
                      <ul>
                        {analysis.suggested_diagnosis?.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="analysis-item">
                      <h4>Medication Recommendations:</h4>
                      <ul>
                        {analysis.medication_recommendations?.map((m, i) => (
                          <li key={i} className="medication-item">
                            <span>{m}</span>
                            <button 
                              className="btn-add-medicine"
                              onClick={() => generatePrescription(m)}
                              title="Add to Medicine Reminder"
                            >
                              <FaPlus /> Add
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {analysis.red_flags?.length > 0 && (
                      <div className="analysis-item alert">
                        <h4>Red Flags:</h4>
                        <ul>
                          {analysis.red_flags.map((flag, i) => (
                            <li key={i}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {(analysis.requires_physical_exam || analysis.requires_emergency_care) && (
                  <div className="recommendation-alert">
                    <h4>Recommendation</h4>
                    <p>
                      {analysis.requires_emergency_care
                        ? 'Emergency care recommended. Please visit the nearest hospital immediately.'
                        : 'Physical examination recommended. Please schedule an in-person visit.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showPrescriptionModal && (
        <div className="prescription-modal-overlay">
          <div className="prescription-modal">
            <div className="prescription-header">
              <h3><FaTablets /> Generate Prescription</h3>
              <button className="close-btn" onClick={() => setShowPrescriptionModal(false)}>X</button>
            </div>
            
            <div className="prescription-form">
              <div className="form-group">
                <label>Tablet Name</label>
                <input
                  type="text"
                  name="tabletName"
                  value={prescriptionForm.tabletName}
                  onChange={handlePrescriptionChange}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={prescriptionForm.quantity}
                    onChange={handlePrescriptionChange}
                    min="1"
                  />
                </div>
                
                <div className="form-group">
                  <label>Dose (mg)</label>
                  <select
                    name="dose"
                    value={prescriptionForm.dose}
                    onChange={handlePrescriptionChange}
                  >
                    <option value="250mg">250mg</option>
                    <option value="500mg">500mg</option>
                    <option value="650mg">650mg</option>
                    <option value="1000mg">1000mg</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Frequency</label>
                  <select
                    name="frequency"
                    value={prescriptionForm.frequency}
                    onChange={handlePrescriptionChange}
                  >
                    <option value="1-0-0">1-0-0 (Morning)</option>
                    <option value="0-1-0">0-1-0 (Afternoon)</option>
                    <option value="0-0-1">0-0-1 (Night)</option>
                    <option value="1-0-1">1-0-1 (Morning & Night)</option>
                    <option value="1-1-1">1-1-1 (3 Times)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Duration</label>
                  <select
                    name="duration"
                    value={prescriptionForm.duration}
                    onChange={handlePrescriptionChange}
                  >
                    <option value="3 days">3 days</option>
                    <option value="5 days">5 days</option>
                    <option value="7 days">7 days</option>
                    <option value="10 days">10 days</option>
                    <option value="14 days">14 days</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹ per unit)</label>
                  <input
                    type="number"
                    name="amount"
                    value={prescriptionForm.amount}
                    onChange={handlePrescriptionChange}
                    min="0"
                    step="0.5"
                  />
                </div>
                
                <div className="form-group">
                  <label>Total Amount (₹)</label>
                  <input
                    type="number"
                    value={prescriptionForm.totalAmount}
                    readOnly
                    className="total-amount"
                  />
                </div>
              </div>
              
              <div className="prescription-summary">
                <h4>Prescription Summary</h4>
                <p><strong>Medicine:</strong> {prescriptionForm.tabletName}</p>
                <p><strong>Quantity:</strong> {prescriptionForm.quantity} tablets</p>
                <p><strong>Dose:</strong> {prescriptionForm.dose}</p>
                <p><strong>Frequency:</strong> {prescriptionForm.frequency}</p>
                <p><strong>Duration:</strong> {prescriptionForm.duration}</p>
                <p className="total"><strong>Total Amount:</strong> ₹{prescriptionForm.totalAmount}</p>
              </div>
              
              <div className="prescription-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => setShowPrescriptionModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-ok"
                  onClick={saveToMedicineReminder}
                >
                  <FaCheck /> Add to Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
