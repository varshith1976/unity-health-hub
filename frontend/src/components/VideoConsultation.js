import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaStar, FaUser, FaClock, FaTimes, FaRobot, FaBrain, FaStethoscope } from 'react-icons/fa';
import { generateClinicalAnalysis } from '../utils/clinicalAnalysis';
import './VideoConsultation.css';

const VideoConsultation = ({ appointment, onEndConsultation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
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
  const recognitionRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const localStreamRef = useRef(null);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);
  const finalResultTimerRef = useRef(null);
  const lastTranscriptRef = useRef('');
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

  // Simple local AI responses (fallback when backend unavailable)
  const getLocalAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    const specialization = appointmentData.specialization || 'General Physician';
    
    // Health keywords check
    const healthKeywords = ['health', 'medical', 'doctor', 'hospital', 'medicine', 'symptom', 'pain', 'fever', 'cough', 'cold', 'headache', 'stomach', 'heart', 'blood', 'pressure', 'diabetes', 'treatment', 'prescription', 'disease', 'illness', 'infection', 'virus', 'bacteria', 'sick', 'unwell', 'ache', 'breathing', 'chest', 'lung', 'liver', 'kidney', 'brain', 'nerve', 'bone', 'joint', 'muscle', 'skin', 'eye', 'ear', 'nose', 'throat', 'pregnancy', 'baby', 'child', 'mental', 'stress', 'anxiety', 'depression', 'sleep', 'nutrition', 'diet', 'exercise', 'weight', 'allergy', 'asthma', 'arthritis', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'fatigue', 'weakness', 'dizziness', 'swelling', 'rash', 'itching', 'bleeding', 'fracture', 'sprain', 'vaccine'];
    
    const isHealthRelated = healthKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (!isHealthRelated) {
      return `I'm specifically designed to help with health and medical concerns related to ${specialization}. Please ask me questions about your symptoms, medical conditions, or health-related topics.`;
    }
    
    // Simple pattern matching responses
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || lowerMessage.includes('hot')) {
      return "I see you have fever. How high is your temperature? Have you taken any medication for it? How long have you had this fever?";
    }
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('migraine') || lowerMessage.includes('dizzy')) {
      return "I'm sorry to hear about your headache. Where exactly does it hurt? Is it sharp or dull pain? How long have you been experiencing this?";
    }
    
    if (lowerMessage.includes('cough') || lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
      return "It sounds like you might have a cold or flu. Do you have any other symptoms like runny nose, sore throat, or body aches?";
    }
    
    if (lowerMessage.includes('stomach') || lowerMessage.includes('nausea') || lowerMessage.includes('vomit') || lowerMessage.includes('diarrhea')) {
      return "I'm concerned about your stomach issue. How long have you been feeling this way? Have you eaten anything unusual recently?";
    }
    
    if (lowerMessage.includes('chest') || lowerMessage.includes('heart') || lowerMessage.includes('palpitation')) {
      return "Chest pain or heart-related symptoms should be taken seriously. How long have you been experiencing this? Is the pain sharp or dull? Does it radiate to your arm or jaw?";
    }
    
    if (lowerMessage.includes('breath') || lowerMessage.includes('breathing') || lowerMessage.includes('lung')) {
      return "I'm concerned about your breathing. Is it difficult to breathe at rest or only during activity? Do you have any history of asthma or respiratory issues?";
    }
    
    if (lowerMessage.includes('skin') || lowerMessage.includes('rash') || lowerMessage.includes('itch')) {
      return "Tell me more about your skin condition. Where is the rash located? Is it itchy or painful? How long have you noticed it?";
    }
    
    if (lowerMessage.includes('joint') || lowerMessage.includes('bone') || lowerMessage.includes('fracture') || lowerMessage.includes('pain')) {
      return "I'm sorry you're experiencing pain. Which area hurts the most? Is it sharp or aching? Did you have any recent injury?";
    }
    
    if (lowerMessage.includes('eye') || lowerMessage.includes('vision') || lowerMessage.includes('blur')) {
      return "Tell me about your eye concern. Is there redness, pain, or discharge? How is your vision - blurry or clear?";
    }
    
    if (lowerMessage.includes('kidney') || lowerMessage.includes('urinate') || lowerMessage.includes('urination')) {
      return "I understand this is a sensitive issue. Do you have any pain while urinating? Is there any blood in urine? How frequently do you urinate?";
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('depression') || lowerMessage.includes('mental')) {
      return "I understand mental health is important. How long have you been feeling this way? Has anything stressful happened recently?";
    }
    
    if (lowerMessage.includes('pregnant') || lowerMessage.includes('pregnancy') || lowerMessage.includes('baby')) {
      return "Congratulations on your pregnancy! How far along are you? What specific concerns would you like to discuss?";
    }
    
    if (lowerMessage.includes('diabetes') || lowerMessage.includes('sugar') || lowerMessage.includes('blood pressure')) {
      return "I see you're managing a chronic condition. What are your recent readings? Are you taking any medications regularly?";
    }
    
    // Default response based on specialization
    if (specialization === 'Cardiologist') {
      return "As a heart specialist, I'm here to help with your cardiovascular concerns. Can you describe what symptoms you're experiencing?";
    }
    if (specialization === 'Neurologist') {
      return "As a brain and nerve specialist, I can help with neurological concerns. What symptoms are you experiencing?";
    }
    if (specialization === 'Dermatologist') {
      return "As a skin specialist, I'm here to help with your skin concerns. Can you describe what you're experiencing?";
    }
    if (specialization === 'Orthopedic Surgeon') {
      return "As a bone and joint specialist, I can help with your musculoskeletal concerns. What pain or issue are you facing?";
    }
    if (specialization === 'Pediatrician') {
      return "As a child healthcare specialist, I'm here to help with your child's health. What concerns do you have about your child?";
    }
    if (specialization === 'Ophthalmologist') {
      return "As an eye specialist, I'm here to help with your vision concerns. What symptoms are you experiencing?";
    }
    if (specialization === 'Nephrologist') {
      return "As a kidney specialist, I can help with kidney and urinary concerns. What symptoms are you experiencing?";
    }
    
    return `I'm ${appointmentData.doctorName}, your ${specialization}. Please tell me about your health concerns. What symptoms are you experiencing, and how long have you had them?`;
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
      if (finalResultTimerRef.current) clearTimeout(finalResultTimerRef.current);
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

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    // Create new recognition instance
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Better for capturing individual utterances
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          finalTranscript = transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        setCurrentTranscript(interimTranscript);
      }

      if (finalTranscript) {
        const finalText = finalTranscript.trim();
        
        if (finalText !== lastTranscriptRef.current && finalText.length > 2) {
          lastTranscriptRef.current = finalText;
          setCurrentTranscript('');
          
          const newTranscript = {
            id: Date.now(),
            text: finalText,
            timestamp: new Date().toLocaleTimeString(),
            speaker: 'patient'
          };
          
          setTranscripts(prev => [...prev, newTranscript]);
          
          setConsultationStats(prev => ({
            ...prev,
            patientSpeakingTime: prev.patientSpeakingTime + 2,
            totalMessages: prev.totalMessages + 1
          }));

          if (aiEnabled && finalText.length > 3) {
            if (finalResultTimerRef.current) clearTimeout(finalResultTimerRef.current);
            
            finalResultTimerRef.current = setTimeout(() => {
              handleAIResponse(finalText);
            }, 1500);
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      if (isRecording) {
        try {
          const newRecognition = new SpeechRecognition();
          newRecognition.continuous = false;
          newRecognition.interimResults = true;
          newRecognition.lang = 'en-US';
          newRecognition.maxAlternatives = 3;
          newRecognition.onresult = recognition.onresult;
          newRecognition.onerror = recognition.onerror;
          newRecognition.onend = recognition.onend;
          recognitionRef.current = newRecognition;
          newRecognition.start();
        } catch (e) {
          console.log('Failed to restart recognition:', e);
        }
      }
    };

    recognitionRef.current = recognition;
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

  // Fixed speakText function with better voice selection
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.pitch = 1.0; // Natural pitch
    utterance.volume = 1;
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      
      let selectedVoice = null;
      
      // Try to find a clear female English voice
      const femaleVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Female') || 
         voice.name.includes('Samantha') || 
         voice.name.includes('Victoria') ||
         voice.name.includes('Zira') ||
         voice.name.includes('Google UK Female') ||
         voice.name.includes('Microsoft Female'))
      );
      
      // If no female voice, try any clear English voice
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
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    
    if (finalResultTimerRef.current) clearTimeout(finalResultTimerRef.current);
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      } catch (e) {
        console.log('Stop error:', e);
      }
      setIsRecording(false);
      setCurrentTranscript('');
    } else {
      lastTranscriptRef.current = '';
      setCurrentTranscript('');
      
      initializeSpeechRecognition();
      
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsRecording(true);
          
          if (!hasGreetedRef.current) {
            hasGreetedRef.current = true;
            setTimeout(() => {
              const greeting = `Hello! I am your AI health assistant. How can I help you today? Please tell me about your health concerns.`;
              const greetingTranscript = {
                id: Date.now(),
                text: greeting,
                timestamp: new Date().toLocaleTimeString(),
                speaker: 'ai'
              };
              setTranscripts(prev => [...prev, greetingTranscript]);
              speakText(greeting);
            }, 1500);
          }
        }
      } catch (e) {
        console.log('Start failed:', e);
        alert('Please allow microphone access to use voice chat.');
      }
    }
  }, [isRecording, appointmentData]);

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
    
    // Generate clinical analysis
    const analysis = generateClinicalAnalysis(transcripts);
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

  // Scroll to bottom of transcript
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts, currentTranscript]);

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
            <div className="video-placeholder" style={{ display: !remoteVideoRef.current?.srcObject ? 'flex' : 'none' }}>
              <FaUser className="user-icon" style={{ fontSize: '5rem', opacity: 0.5 }} />
              <p>Waiting for {appointmentData.doctorName}...</p>
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
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        
        <button 
          className={`control-btn ${isVideoOff ? 'active' : ''}`}
          onClick={toggleVideo}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
        </button>

        <button 
          className={`control-btn record-btn ${isRecording ? 'recording' : ''}`}
          onClick={toggleRecording}
          title={isRecording ? 'Stop Voice Chat' : 'Start Voice Chat'}
        >
          {isRecording ? <span className="recording-dot">●</span> : <FaMicrophone />}
          <span className="btn-label">{isRecording ? 'Listening...' : 'Start Voice'}</span>
        </button>

        <button 
          className={`control-btn ai-btn ${aiEnabled ? 'active' : ''}`}
          onClick={toggleAI}
          title={aiEnabled ? 'Disable AI' : 'Enable AI'}
        >
          <FaRobot />
          <span className="btn-label">AI {aiEnabled ? 'ON' : 'OFF'}</span>
        </button>

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
        <h3>Live Transcript 
          {aiEnabled && <span className="ai-badge"><FaRobot /> AI Enabled - {appointmentData.specialization}</span>}
        </h3>
        
        <div className="transcript-box" ref={transcriptContainerRef}>
          {transcripts.length === 0 && !currentTranscript && (
            <p className="no-transcript">
              Welcome! Click "Start Voice" button and tell me your health concerns.<br/>
              I'm {appointmentData.doctorName}, specializing in {appointmentData.specialization}.<br/>
              How can I help you today?
            </p>
          )}
          
          {transcripts.map((t) => (
            <div key={t.id} className={`transcript-item ${t.speaker}`}>
              <span className="speaker">
                {t.speaker === 'patient' ? 'You' : t.speaker === 'ai' ? 'AI Doctor' : 'Doctor'}:
              </span>
              <span className="text">{t.text}</span>
            </div>
          ))}
          
          {currentTranscript && (
            <div className="transcript-item interim">
              <span className="speaker">You:</span>
              <span className="text">{currentTranscript}</span>
            </div>
          )}
        </div>
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

            <button className="btn btn-primary" onClick={handleContinueToFeedback}>
              Continue to Feedback
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
