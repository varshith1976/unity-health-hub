import React, { useState, useEffect, useRef } from 'react';
import { FaVideo, FaVideoSlash, FaPhoneSlash, FaStar, FaUser, FaClock, FaTimes, FaRobot, FaBrain, FaStethoscope, FaPaperPlane } from 'react-icons/fa';
import { generateClinicalAnalysis } from '../utils/clinicalAnalysis';
import { getAIResponse } from '../utils/aiResponses';
import './VideoConsultation.css';

const VideoConsultation = ({ appointment, onEndConsultation }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [patientInput, setPatientInput] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [clinicalAnalysis, setClinicalAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [consultationStats, setConsultationStats] = useState({
    doctorName: '',
    specialization: '',
    startTime: null,
    patientSpeakingTime: 0,
    aiSpeakingTime: 0,
    totalMessages: 0
  });
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const localStreamRef = useRef(null);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);
  const hasGreetedRef = useRef(false);

  // Get appointment data - handle different field names
  const appointmentData = React.useMemo(() => {
    if (!appointment) {
      return {
        id: 1,
        doctorName: 'Dr. Sharma',
        specialization: 'General Physician',
        patientName: 'Patient',
        doctor_id: 1,
        patient_id: 1
      };
    }
    
    return {
      id: appointment.id || 1,
      doctorName: appointment.doctorName || appointment.doctor_name || 'Dr. Sharma',
      specialization: appointment.specialization || 'General Physician',
      patientName: appointment.patientName || appointment.patient_name || 'Patient',
      doctor_id: appointment.doctorId || appointment.doctor_id || 1,
      patient_id: appointment.patientId || appointment.patient_id || 1,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      bookingId: appointment.bookingId
    };
  }, [appointment]);

  // Use the new comprehensive AI responses
  const getLocalAIResponse = (message) => {
    return getAIResponse(message, appointmentData.specialization || 'General Physician');
  };

  // Call AI API
  const callAIAPI = async (patientMessage) => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const conversationContext = transcripts.map(t => 
        `${t.speaker === 'patient' ? 'Patient' : 'AI Doctor'}: ${t.text}`
      ).join('\n');

      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: patientMessage,
          symptoms: {
            mainComplaint: patientMessage,
            doctorName: appointmentData.doctorName,
            specialization: appointmentData.specialization,
          },
          conversationHistory: conversationContext
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.log('Using local AI response:', error.message);
      return null;
    }
  };

  useEffect(() => {
    initializeMedia();
    startTimer();

    setConsultationStats(prev => ({
      ...prev,
      doctorName: appointmentData.doctorName || 'Doctor',
      specialization: appointmentData.specialization || 'General Physician',
      startTime: new Date()
    }));

    return () => {
      cleanup();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appointmentData]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      secondsRef.current += 1;
      const mins = Math.floor(secondsRef.current / 60);
      const secs = secondsRef.current % 60;
      const timerEl = document.getElementById('timer');
      if (timerEl) timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setConnectionStatus('ready');
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setConnectionStatus('error');
    }
  };

  const handleAIResponse = async (patientMessage) => {
    if (!aiEnabled || isAILoading) return;
    
    setIsAILoading(true);
    
    try {
      let aiResponse = await callAIAPI(patientMessage);
      
      if (!aiResponse) {
        aiResponse = getLocalAIResponse(patientMessage);
      }

      const aiTranscript = {
        id: Date.now(),
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
        speaker: 'ai'
      };
      
      setTranscripts(prev => [...prev, aiTranscript]);
      
      setConsultationStats(prev => ({
        ...prev,
        aiSpeakingTime: prev.aiSpeakingTime + 3,
        totalMessages: prev.totalMessages + 1
      }));

      speakText(aiResponse);

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const fallbackResponse = getLocalAIResponse(patientMessage);
      
      const errorTranscript = {
        id: Date.now(),
        text: fallbackResponse,
        timestamp: new Date().toLocaleTimeString(),
        speaker: 'ai'
      };
      setTranscripts(prev => [...prev, errorTranscript]);
      speakText(fallbackResponse);
    } finally {
      setIsAILoading(false);
    }
  };

  // Speak text function
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      
      let selectedVoice = null;
      
      const femaleVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Female') || 
         voice.name.includes('Samantha') || 
         voice.name.includes('Victoria') ||
         voice.name.includes('Zira'))
      );
      
      if (!femaleVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('English') || 
           voice.name.includes('US') ||
           voice.name.includes('UK'))
        );
      }
      
      selectedVoice = femaleVoice || selectedVoice || voices[0];
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      setTimeout(() => {
        if (window.speechSynthesis.getVoices().length > 0) {
          loadVoices();
        } else {
          window.speechSynthesis.speak(utterance);
        }
      }, 100);
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.log('Speech error:', e);
      setIsSpeaking(false);
    };
  };

  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Start consultation - AI greets first
  const startConsultation = () => {
    setConsultationStarted(true);
    
    if (!hasGreetedRef.current) {
      hasGreetedRef.current = true;
      setTimeout(() => {
        const greeting = `Hello! I am your AI health assistant. I am ${appointmentData.doctorName}, specializing in ${appointmentData.specialization}. Please tell me about your health concerns. What symptoms are you experiencing? You can type your response below.`;
        const greetingTranscript = {
          id: Date.now(),
          text: greeting,
          timestamp: new Date().toLocaleTimeString(),
          speaker: 'ai'
        };
        setTranscripts(prev => [...prev, greetingTranscript]);
        speakText(greeting);
      }, 1000);
    }
  };

  // Handle sending patient message
  const handleSendMessage = () => {
    if (!patientInput.trim() || isAILoading) return;
    
    const newTranscript = {
      id: Date.now(),
      text: patientInput,
      timestamp: new Date().toLocaleTimeString(),
      speaker: 'patient'
    };
    
    setTranscripts(prev => [...prev, newTranscript]);
    setConsultationStats(prev => ({
      ...prev,
      patientSpeakingTime: prev.patientSpeakingTime + 2,
      totalMessages: prev.totalMessages + 1
    }));
    
    const message = patientInput;
    setPatientInput('');
    
    // Get AI response after a short delay
    setTimeout(() => {
      handleAIResponse(message);
    }, 500);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    setIsVideoOff(!isVideoOff);
  };

  const toggleAI = () => setAiEnabled(!aiEnabled);

  const handleEndConsultation = () => setShowEndModal(true);

  const confirmEndConsultation = async () => {
    window.speechSynthesis.cancel();
    cleanup();
    
    const analysis = generateClinicalAnalysis(transcripts, appointmentData.specialization);
    setClinicalAnalysis(analysis);
    
    setShowEndModal(false);
    setShowAnalysis(true);
  };

  const handleContinueToFeedback = () => {
    setShowAnalysis(false);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setFeedbackSubmitted(true);

    const consultationData = {
      id: Date.now(),
      doctorName: appointmentData.doctorName,
      specialization: appointmentData.specialization,
      date: new Date().toISOString(),
      duration: secondsRef.current,
      patientSpeakingTime: consultationStats.patientSpeakingTime,
      aiSpeakingTime: consultationStats.aiSpeakingTime,
      totalMessages: consultationStats.totalMessages,
      transcript: transcripts,
      aiAnalysis: clinicalAnalysis,
      rating: rating,
      feedbackText: feedbackText
    };
    
    const existingHistory = JSON.parse(localStorage.getItem('consultationHistory') || '[]');
    existingHistory.unshift(consultationData);
    localStorage.setItem('consultationHistory', JSON.stringify(existingHistory));

    setTimeout(() => {
      setShowFeedbackModal(false);
      onEndConsultation(consultationData);
    }, 1500);
  };

  const handleSkipFeedback = () => {
    const consultationData = {
      id: Date.now(),
      doctorName: appointmentData.doctorName,
      specialization: appointmentData.specialization,
      date: new Date().toISOString(),
      duration: secondsRef.current,
      transcript: transcripts
    };
    
    const existingHistory = JSON.parse(localStorage.getItem('consultationHistory') || '[]');
    existingHistory.unshift(consultationData);
    localStorage.setItem('consultationHistory', JSON.stringify(existingHistory));
    
    setShowFeedbackModal(false);
    onEndConsultation(consultationData);
  };

  // Add medications to Medication Reminder
  const addToMedicationReminder = () => {
    if (!clinicalAnalysis || !clinicalAnalysis.medication_recommendations) return;
    
    const medications = clinicalAnalysis.medication_recommendations;
    const STORAGE_KEY = 'healthcare_medications';
    
    try {
      // Get existing medications
      const existingMeds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      
      // Parse each medication recommendation and add to list
      const newMeds = medications
        .filter(med => !med.includes('Rest and adequate sleep') && 
                       !med.includes('Drink plenty') && 
                       !med.includes('Warm salt water') &&
                       !med.includes('Steam inhalation') &&
                       !med.includes('Honey and ginger') &&
                       !med.includes('Balanced diet') &&
                       !med.includes('Probiotics'))
        .slice(0, 6) // Limit to 6 medications
        .map((med, index) => {
          // Extract medicine name and dosage
          const parts = med.split('(')[0].trim();
          const dosageMatch = med.match(/\d+\s*(mg|ml|g|iu|mcg)/i);
          const dosage = dosageMatch ? dosageMatch[0] : 'As directed';
          
          // Determine time slots based on medication type
          let times = ['08:00'];
          if (med.includes('twice') || med.includes('twice daily')) {
            times = ['08:00', '20:00'];
          } else if (med.includes('three times') || med.includes('thrice')) {
            times = ['08:00', '14:00', '20:00'];
          } else if (med.includes('night') || med.includes('bedtime')) {
            times = ['21:00'];
          } else if (med.includes('morning') || med.includes('breakfast')) {
            times = ['08:00'];
          }
          
          return {
            id: `${Date.now()}-${index}`,
            name: parts,
            dosage: dosage,
            times: times,
            durationDays: 7,
            mealInstruction: med.includes('food') ? 'after-food' : 'any',
            startDate: new Date().toISOString().split('T')[0],
            status: 'pending'
          };
        });
      
      // Add new medications to existing ones
      const updatedMeds = [...existingMeds, ...newMeds];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMeds));
      
      alert(`${newMeds.length} medications added to your Medication Reminder!`);
    } catch (error) {
      console.error('Error adding medications:', error);
      alert('Failed to add medications. Please try again.');
    }
  };

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts]);

  return (
    <div className="video-consultation-container">
      <div className="consultation-header">
        <div className="consultation-info">
          <h2>Video Consultation</h2>
          <span className={`status-badge ${connectionStatus}`}>
            {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'connecting' ? 'Connecting...' : 'Ready'}
          </span>
        </div>
        
        <div className="doctor-context">
          <FaStethoscope />
          <div>
            <span className="doctor-name">{appointmentData.doctorName}</span>
            <span className="specialization">{appointmentData.specialization}</span>
          </div>
        </div>
        
        <div className="consultation-time">
          <FaClock /> <span id="timer">00:00</span>
        </div>
      </div>

      <div className="video-section">
        <div className="video-container">
          <div className="remote-video">
            <video ref={remoteVideoRef} autoPlay playsInline />
            <div className="video-placeholder">
              <div className="waiting-content">
                <div className="waiting-avatar">
                  <FaUser className="user-icon" style={{ fontSize: '4rem', opacity: 0.7 }} />
                </div>
                <h3>Waiting for {appointmentData.doctorName}</h3>
                <p className="waiting-message">Your doctor will join shortly...</p>
                <p className="waiting-hint">You can start chatting below while waiting</p>
                {!consultationStarted && (
                  <button 
                    className="btn btn-primary start-btn"
                    onClick={startConsultation}
                    style={{ marginTop: '15px' }}
                  >
                    Start AI Consultation
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="local-video">
            <video ref={localVideoRef} autoPlay playsInline muted />
            {isVideoOff && (
              <div className="video-off-overlay">
                <FaVideoSlash style={{ fontSize: '2rem' }} />
                <p>Camera Off</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="controls-section">
        <button 
          className={`control-btn ${isMuted ? 'active' : ''}`}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FaVideoSlash /> : <FaVideo />}
        </button>
        
        <button 
          className={`control-btn ${isVideoOff ? 'active' : ''}`}
          onClick={toggleVideo}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
        </button>

        {!consultationStarted ? (
          <button 
            className="control-btn record-btn"
            onClick={startConsultation}
            title="Start Consultation"
          >
            <FaRobot />
            <span className="btn-label">Start Chat</span>
          </button>
        ) : (
          <button 
            className={`control-btn ai-btn ${aiEnabled ? 'active' : ''}`}
            onClick={toggleAI}
            title={aiEnabled ? 'Disable AI' : 'Enable AI'}
          >
            <FaRobot />
            <span className="btn-label">AI {aiEnabled ? 'ON' : 'OFF'}</span>
          </button>
        )}

        {isSpeaking && (
          <div className="ai-speaking-indicator">
            <FaBrain /> AI Speaking...
          </div>
        )}

        <button 
          className="control-btn end-btn"
          onClick={handleEndConsultation}
          title="End Consultation"
        >
          <FaPhoneSlash />
          <span className="btn-label">End</span>
        </button>
      </div>

      <div className="transcript-section">
        <h3>Live Chat 
          {aiEnabled && <span className="ai-badge"><FaRobot /> AI Enabled - {appointmentData.specialization}</span>}
        </h3>
        
        <div className="transcript-box" ref={transcriptContainerRef}>
          {!consultationStarted ? (
            <div className="no-transcript" style={{ textAlign: 'center', padding: '40px' }}>
              <p>Welcome to your {appointmentData.specialization} consultation!</p>
              <p>Click "Start Chat" button to begin your consultation with the AI Doctor.</p>
              <button 
                className="btn btn-primary" 
                onClick={startConsultation}
                style={{ marginTop: '20px', padding: '12px 30px', fontSize: '16px' }}
              >
                Start Consultation
              </button>
            </div>
          ) : (
            <>
              {transcripts.map((t) => (
                <div key={t.id} className={`transcript-item ${t.speaker}`}>
                  <span className="speaker">
                    {t.speaker === 'patient' ? 'You' : t.speaker === 'ai' ? 'AI Doctor' : 'Doctor'}:
                  </span>
                  <span className="text">{t.text}</span>
                </div>
              ))}
              
              {isAILoading && (
                <div className="transcript-item ai">
                  <span className="speaker">AI Doctor:</span>
                  <span className="text" style={{ fontStyle: 'italic', color: '#888' }}>Typing...</span>
                </div>
              )}
            </>
          )}
        </div>

        {consultationStarted && (
          <div className="chat-input-container">
            <input
              type="text"
              value={patientInput}
              onChange={(e) => setPatientInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your symptoms or questions here..."
              className="chat-input"
              disabled={isAILoading}
            />
            <button 
              className="chat-send-btn"
              onClick={handleSendMessage}
              disabled={!patientInput.trim() || isAILoading}
            >
              <FaPaperPlane />
            </button>
          </div>
        )}
      </div>

      {showEndModal && (
        <div className="analysis-modal">
          <div className="analysis-content">
            <h3>End Consultation?</h3>
            <p>Are you sure you want to end this consultation?</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowEndModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmEndConsultation}>
                Yes, End Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalysis && clinicalAnalysis && (
        <div className="analysis-modal">
          <div className="analysis-content clinical-analysis">
            <h3>🤖 AI Clinical Analysis</h3>
            
            <div className="analysis-section">
              <h4>Symptoms Identified:</h4>
              <ul className="symptoms-list">
                {clinicalAnalysis.symptoms_identified.map((symptom, i) => (
                  <li key={i}>{symptom}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h4>Severity Level:</h4>
              <span className={`severity-badge ${clinicalAnalysis.severity_level}`}>
                {clinicalAnalysis.severity_level.toUpperCase()}
              </span>
            </div>

            {clinicalAnalysis.risk_factors.length > 0 && (
              <div className="analysis-section">
                <h4>Risk Factors:</h4>
                <ul>
                  {clinicalAnalysis.risk_factors.map((risk, i) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="analysis-section">
              <h4>Suggested Diagnosis:</h4>
              <ul className="diagnosis-list">
                {clinicalAnalysis.suggested_diagnosis.map((diagnosis, i) => (
                  <li key={i}>{diagnosis}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-section medications">
              <h4>💊 Medication Recommendations ({clinicalAnalysis.medication_recommendations.length}):</h4>
              <ul className="medication-list">
                {clinicalAnalysis.medication_recommendations.map((med, i) => (
                  <li key={i}>{med}</li>
                ))}
              </ul>
            </div>

            {clinicalAnalysis.red_flags.length > 0 && (
              <div className="analysis-section red-flags">
                <h4>⚠️ Red Flags:</h4>
                <ul>
                  {clinicalAnalysis.red_flags.map((flag, i) => (
                    <li key={i}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {clinicalAnalysis.requires_emergency_care && (
              <div className="emergency-alert">
                <strong>⚠️ EMERGENCY CARE REQUIRED</strong>
                <p>Please visit the nearest hospital immediately.</p>
              </div>
            )}

            {clinicalAnalysis.requires_physical_exam && !clinicalAnalysis.requires_emergency_care && (
              <div className="exam-alert">
                <strong>📋 Physical Examination Recommended</strong>
                <p>Please schedule an in-person visit for detailed examination.</p>
              </div>
            )}

            <button className="btn btn-primary ok-btn" onClick={() => {
              addToMedicationReminder();
              handleContinueToFeedback();
            }}>
              ✓ OK - Add to Medication Reminder
            </button>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="analysis-modal">
          <div className="analysis-content feedback-modal">
            <button className="close-btn" onClick={handleSkipFeedback}>
              <FaTimes />
            </button>
            
            {feedbackSubmitted ? (
              <div className="feedback-success">
                <h3>Thank You!</h3>
                <p>Your feedback has been submitted successfully.</p>
                <div className="consultation-summary">
                  <h4>Consultation Summary</h4>
                  <p><strong>Doctor:</strong> {appointmentData.doctorName}</p>
                  <p><strong>Specialization:</strong> {appointmentData.specialization}</p>
                  <p><strong>Duration:</strong> {Math.floor(secondsRef.current / 60)}:{String(secondsRef.current % 60).padStart(2, '0')}</p>
                  <p><strong>Total Conversations:</strong> {transcripts.length}</p>
                </div>
              </div>
            ) : (
              <>
                <h3>Rate Your Experience</h3>
                <p>How was your consultation?</p>
                
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star-btn ${rating >= star ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
                
                <div className="feedback-textarea">
                  <label>Your Feedback (Optional)</label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows="4"
                  />
                </div>
                
                <div className="feedback-actions">
                  <button className="btn btn-secondary" onClick={handleSkipFeedback}>
                    Skip
                  </button>
                  <button className="btn btn-primary" onClick={handleSubmitFeedback}>
                    Submit Feedback
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultation;
