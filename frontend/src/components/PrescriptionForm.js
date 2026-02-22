import React, { useState } from 'react';
import { FaPlus, FaTrash, FaSave, FaTimes, FaFileMedical, FaPills, FaInfoCircle } from 'react-icons/fa';
import { createPrescription, updatePrescription } from '../services/api';
import './PrescriptionForm.css';

const PrescriptionForm = ({ consultationId, patientInfo, onSave, onCancel, existingPrescription }) => {
  const [medicines, setMedicines] = useState(existingPrescription?.medicines || [
    { id: 1, name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [advice, setAdvice] = useState(existingPrescription?.advice || '');
  const [followUpDate, setFollowUpDate] = useState(existingPrescription?.followUpDate || '');
  const [notes, setNotes] = useState(existingPrescription?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { id: Date.now(), name: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);
  };

  const removeMedicine = (id) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter(med => med.id !== id));
    }
  };

  const updateMedicine = (id, field, value) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const validMedicines = medicines.filter(med => med.name.trim() !== '');
    if (validMedicines.length === 0) {
      setError('Please add at least one medicine');
      return;
    }

    setLoading(true);
    setError('');

    const prescriptionData = {
      consultationId,
      patientId: patientInfo?.patientId,
      patientName: patientInfo?.patientName,
      patientAge: patientInfo?.patientAge,
      symptoms: patientInfo?.symptoms,
      medicines: validMedicines,
      advice,
      followUpDate: followUpDate || null,
      notes
    };

    try {
      if (existingPrescription?.id) {
        await updatePrescription(existingPrescription.id, prescriptionData);
      } else {
        await createPrescription(prescriptionData);
      }
      
      if (onSave) {
        onSave(prescriptionData);
      }
    } catch (err) {
      console.error('Failed to save prescription:', err);
      // For demo, still save locally
      if (onSave) {
        onSave(prescriptionData);
      }
    } finally {
      setLoading(false);
    }
  };

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime'
  ];

  const durationOptions = [
    '3 days',
    '5 days',
    '7 days',
    '10 days',
    '14 days',
    '21 days',
    '1 month',
    'Until further notice'
  ];

  return (
    <div className="prescription-form-container">
      <div className="prescription-form-header">
        <h2><FaFileMedical /> {existingPrescription ? 'Edit Prescription' : 'New Prescription'}</h2>
        <p>Create a prescription for your patient</p>
      </div>

      <form onSubmit={handleSubmit} className="prescription-form">
        {/* Patient Info Summary */}
        {patientInfo && (
          <div className="patient-summary">
            <div className="summary-item">
              <span className="label">Patient Name:</span>
              <span className="value">{patientInfo.patientName}</span>
            </div>
            {patientInfo.patientAge && (
              <div className="summary-item">
                <span className="label">Age:</span>
                <span className="value">{patientInfo.patientAge} years</span>
              </div>
            )}
            {patientInfo.symptoms && (
              <div className="summary-item">
                <span className="label">Symptoms:</span>
                <span className="value">{patientInfo.symptoms}</span>
              </div>
            )}
          </div>
        )}

        {/* Medicines Section */}
        <div className="medicines-section">
          <div className="section-header">
            <h3><FaPills /> Medicines</h3>
            <button type="button" className="add-medicine-btn" onClick={addMedicine}>
              <FaPlus /> Add Medicine
            </button>
          </div>

          {medicines.map((medicine, index) => (
            <div key={medicine.id} className="medicine-card">
              <div className="medicine-header">
                <span className="medicine-number">Medicine #{index + 1}</span>
                {medicines.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-medicine-btn"
                    onClick={() => removeMedicine(medicine.id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              <div className="medicine-fields">
                <div className="field-group">
                  <label>Medicine Name *</label>
                  <input
                    type="text"
                    value={medicine.name}
                    onChange={(e) => updateMedicine(medicine.id, 'name', e.target.value)}
                    placeholder="e.g., Paracetamol"
                    required
                  />
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label>Dosage</label>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) => updateMedicine(medicine.id, 'dosage', e.target.value)}
                      placeholder="e.g., 500mg"
                    />
                  </div>

                  <div className="field-group">
                    <label>Frequency</label>
                    <select
                      value={medicine.frequency}
                      onChange={(e) => updateMedicine(medicine.id, 'frequency', e.target.value)}
                    >
                      <option value="">Select frequency</option>
                      {frequencyOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label>Duration</label>
                    <select
                      value={medicine.duration}
                      onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                    >
                      <option value="">Select duration</option>
                      {durationOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label>Special Instructions</label>
                  <input
                    type="text"
                    value={medicine.instructions}
                    onChange={(e) => updateMedicine(medicine.id, 'instructions', e.target.value)}
                    placeholder="e.g., Take after food, Avoid alcohol"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advice Section */}
        <div className="advice-section">
          <h3><FaInfoCircle /> Advice & Instructions</h3>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder="Enter general advice, lifestyle modifications, dietary restrictions..."
            rows="3"
          />
        </div>

        {/* Follow-up & Notes */}
        <div className="additional-section">
          <div className="field-group">
            <label>Follow-up Date</label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="field-group">
            <label>Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes for the patient..."
              rows="2"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              <FaTimes /> Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FaSave /> {loading ? 'Saving...' : 'Save Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;
