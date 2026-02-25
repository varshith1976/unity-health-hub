import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaUser, FaTimes, FaPaperPlane, FaDownload, FaCheckCircle, FaPlus, FaBell, FaMicrophone, FaStop } from 'react-icons/fa';
import { getAIResponse } from '../utils/aiResponses';
import './AIDoctor.css';

const GROQ_API_KEY = 'GROQ_API_KEY';

const AIDoctor = ({ onEndConsultation, onNavigateToMedicines }) => {
  const [messages, setMessages] = useState([]);
  const [patientInput, setPatientInput] = useState('');
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [showOkButton, setShowOkButton] = useState(false);
  const [isGeneratingPrescription, setIsGeneratingPrescription] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const doctorInfo = {
    name: 'Dr. AI Assistant',
    specialization: 'General Physician',
    hospital: 'Unity Health Hub'
  };

  const symptomDatabase = {
    fever: {
      keywords: ['fever', 'temperature', 'hot body', 'febrile', 'high temperature', 'high fever', 'feeling hot'],
      response: "For fever, I recommend:\n\nMedicines:\n- Tab. Paracetamol 500mg - 1 tablet when needed (max 4/day)\n- Tab. Vitamin C 1000mg - 1 tablet daily\n\nAdvice:\n- Drink plenty of water (8+ glasses daily)\n- Get complete rest\n- Sponge with lukewarm water\n- Avoid cold drinks\n\nConsult a doctor if fever persists beyond 3 days!",
      medicines: [
        { name: 'Paracetamol 500mg', timing: { morning: '8:00 AM', afternoon: '2:00 PM', night: '8:00 PM' }, duration: '5', dosage: '1 tablet', instructions: 'After food when needed', quantity: 15 },
        { name: 'Vitamin C 1000mg', timing: { morning: '8:00 AM' }, duration: '10', dosage: '1 tablet', instructions: 'With breakfast', quantity: 10 }
      ]
    },
    cold: {
      keywords: ['cold', 'running nose', 'nasal', 'sneezing', 'flu', 'congestion', 'nasal congestion', 'stuffy nose'],
      response: "For cold, I recommend:\n\nMedicines:\n- Tab. Cetrizine 10mg - 1 tablet at night\n- Tab. Vitamin C 1000mg - 1 tablet daily\n- Syrup. Alex 1 tsp - 3 times daily\n\nAdvice:\n- Drink warm water with lemon and honey\n- Get plenty of rest\n- Use steam inhalation\n- Avoid cold drinks and AC\n\nMost colds improve in 5-7 days!",
      medicines: [
        { name: 'Cetrizine 10mg', timing: { night: '10:00 PM' }, duration: '5', dosage: '1 tablet', instructions: 'At night', quantity: 5 },
        { name: 'Vitamin C 1000mg', timing: { morning: '8:00 AM' }, duration: '10', dosage: '1 tablet', instructions: 'With breakfast', quantity: 10 },
        { name: 'Alex Syrup', timing: { morning: '8:00 AM', afternoon: '2:00 PM', night: '8:00 PM' }, duration: '5', dosage: '1 tsp', instructions: 'After food', quantity: 15 }
      ]
    },
    cough: {
      keywords: ['cough', 'coughing', 'throat pain', 'phlegm', 'dry cough', 'wet cough', 'chest congestion'],
      response: "For cough, I recommend:\n\nMedicines:\n- Syrup. Benadryl 1 tsp - 3 times daily\n- Tab. Bisolvan 1 tablet - 3 times daily\n- Tab. Codeine 10mg - 1 tablet at night (if severe)\n\nAdvice:\n- Drink warm water\n- Take honey (if not diabetic)\n- Avoid cold drinks\n- Use humidifier\n\nConsult a doctor if cough lasts more than 2 weeks!",
      medicines: [
        { name: 'Benadryl Syrup', timing: { morning: '8:00 AM', afternoon: '2:00 PM', night: '8:00 PM' }, duration: '5', dosage: '1 tsp', instructions: 'After food', quantity: 15 },
        { name: 'Bisolvan', timing: { morning: '8:00 AM', afternoon: '2:00 PM', night: '8:00 PM' }, duration: '5', dosage: '1 tablet', instructions: 'After food', quantity: 15 }
      ]
    },
    headache: {
      keywords: ['headache', 'head pain', 'migraine', 'head ache', 'severe headache', 'temple pain'],
      response: "For headache, I recommend:\n\nMedicines:\n- Tab. Paracetamol 500mg - 1 tablet when needed\n- Tab. Ibuprofen 400mg - 1 tablet after food (if severe)\n- Tab. Domstal 10mg - 1 tablet (if with nausea)\n\nAdvice:\n- Rest in a quiet, dark room\n- Drink water - dehydration causes headaches\n- Avoid screen time\n- Apply lemon juice on forehead\n\nSeek urgent care if severe headache with fever!",
      medicines: [
        { name: 'Paracetamol 500mg', timing: { morning: '8:00 AM', afternoon: '2:00 PM' }, duration: '3', dosage: '1 tablet', instructions: 'When needed', quantity: 6 },
        { name: 'Ibuprofen 400mg', timing: { afternoon: '2:00 PM' }, duration: '3', dosage: '1 tablet', instructions: 'After food when needed', quantity: 3 }
      ]
    },
    stomach: {
      keywords: ['stomach pain', 'belly pain', 'abdominal pain', 'stomach ache', 'gas', 'acidity', 'indigestion', 'heartburn'],
      response: "For stomach pain, I recommend:\n\nMedicines:\n- Tab. Pantocid 40mg - 1 tablet on empty stomach\n- Tab. Digene 1 tablet - after meals\n- Tab. Domstal 10mg - 1 tablet before food\n\nAdvice:\n- Avoid spicy food\n- Drink warm water\n- Eat light meals\n- Don't eat fast\n\nGo to hospital if severe pain or vomiting!",
      medicines: [
        { name: 'Pantocid 40mg', timing: { morning: '8:00 AM' }, duration: '7', dosage: '1 tablet', instructions: 'Empty stomach', quantity: 7 },
        { name: 'Digene', timing: { afternoon: '2:00 PM', night: '8:00 PM' }, duration: '7', dosage: '1 tablet', instructions: 'After food', quantity: 14 },
        { name: 'Domstal 10mg', timing: { morning: '8:00 AM', night: '8:00 PM' }, duration: '5', dosage: '1 tablet', instructions: 'Before food', quantity: 10 }
      ]
    },
    bodyPain: {
      keywords: ['body pain', 'body ache', 'muscle pain', 'joint pain', 'back pain', 'leg pain', 'arm pain'],
      response: "For body pain, I recommend:\n\nMedicines:\n- Tab. Ibuprofen 400mg - 1 tablet after food when needed\n- Tab. Aceclofenac 100mg - 1 tablet twice daily\n- Gel. Volini - Apply on affected area\n\nAdvice:\n- Rest properly\n- Apply warm compress on affected area\n- Take pain reliever after food\n- Gentle massage\n\nConsult a doctor if pain persists more than a week!",
      medicines: [
        { name: 'Ibuprofen 400mg', timing: { morning: '8:00 AM', night: '8:00 PM' }, duration: '5', dosage: '1 tablet', instructions: 'After food', quantity: 10 },
        { name: 'Aceclofenac 100mg', timing: { morning: '8:00 AM', night: '8:00 PM' }, duration: '5', dosage: '1 tablet', instructions: 'After food', quantity: 10 }
      ]
    },
    vomiting: {
      keywords: ['vomit', 'throwing up', 'nausea', 'feeling sick', 'throw up'],
      response: "For vomiting, I recommend:\n\nMedicines:\n- Tab. Ondansetron 4mg - 1 tablet when needed\n- ORS solution - 1 packet in 1 liter water\n- Tab. Domstal 10mg - 1 tablet before food\n\nAdvice:\n- Sip ORS solution slowly\n- Start with light food (rice, banana)\n- Avoid dairy initially\n\nGo to hospital if blood in vomit or severe dehydration!",
      medicines: [
        { name: 'Ondansetron 4mg', timing: { morning: '8:00 AM', afternoon: '2:00 PM' }, duration: '3', dosage: '1 tablet', instructions: 'When needed', quantity: 6 },
        { name: 'ORS', timing: { morning: '8:00 AM', afternoon: '2:00 PM', evening: '6:00 PM' }, duration: '3', dosage: '1 packet', instructions: 'In 1 liter water', quantity: 6 }
      ]
    },
    diarrhea: {
      keywords: ['diarrhea', 'loose motion', 'watery stool', 'upset stomach', 'frequent stool'],
      response: "For diarrhea, I recommend:\n\nMedicines:\n- Oflox 200mg - 1 tablet twice daily\n- ORS solution - 1 packet in 1 liter water\n- Tab. Loperamide 2mg - 1 tablet after each stool (max 8)\n\nAdvice:\n- Drink plenty of fluids\n- Eat bland food (rice, banana, toast)\n- Avoid dairy\n\nConsult a doctor if diarrhea lasts more than 3 days!",
      medicines: [
        { name: 'Oflox 200mg', timing: { morning: '8:00 AM', night: '8:00 PM' }, duration: '3', dosage: '1 tablet', instructions: 'After food', quantity: 6 },
        { name: 'ORS', timing: { morning: '8:00 AM', afternoon: '2:00 PM', evening: '6:00 PM' }, duration: '3', dosage: '1 packet', instructions: 'In 1 liter water', quantity: 6 }
      ]
    },
    dizziness: {
      keywords: ['dizzy', 'dizziness', 'lightheaded', 'vertigo', 'feeling faint'],
      response: "For dizziness, I recommend:\n\nMedicines:\n- Tab. Stugeron 25mg - 1 tablet thrice daily\n- Tab. Betahistine 16mg - 1 tablet thrice daily\n\nAdvice:\n- Sit or lie down immediately\n- Drink water\n- Avoid sudden movements\n- Don't drive\n\nConsult a doctor if dizziness is frequent!",
      medicines: [
        { name: 'Stugeron 25mg', timing: { morning: '8:00 AM', afternoon: '2:00 PM', night: '8:00 PM' }, duration: '7', dosage: '1 tablet', instructions: 'After food', quantity: 21 }
      ]
    },
    allergy: {
      keywords: ['allergy', 'allergic', 'skin rash', 'itching', 'itchy', 'hives'],
      response: "For allergy, I recommend:\n\nMedicines:\n- Tab. Cetrizine 10mg - 1 tablet at night\n- Tab. Fexofenadine 180mg - 1 tablet daily\n- Lotion. Calamine - Apply on rash\n\nAdvice:\n- Avoid known allergens\n- Wear loose cotton clothes\n- Don't scratch the affected area\n- Keep skin moisturized\n\nConsult a doctor if severe!",
      medicines: [
        { name: 'Cetrizine 10mg', timing: { night: '10:00 PM' }, duration: '7', dosage: '1 tablet', instructions: 'At night', quantity: 7 },
        { name: 'Fexofenadine 180mg', timing: { morning: '8:00 AM' }, duration: '7', dosage: '1 tablet', instructions: 'With breakfast', quantity: 7 }
      ]
    },
    diabetes: {
      keywords: ['diabetes', 'sugar', 'blood sugar', 'high glucose', 'diabetic'],
      response: "For diabetes management, I recommend:\n\nMedicines:\n- Tab. Metformin 500mg - 1 tablet twice daily\n- Tab. Glimepride 1mg - 1 tablet daily (as per doctor's advice)\n\nAdvice:\n- Check blood sugar regularly\n- Avoid sugar and sweets\n- Eat whole grains and vegetables\n- Exercise daily\n\nIMPORTANT: Consult a doctor for proper diabetes management!",
      medicines: [
        { name: 'Metformin 500mg', timing: { morning: '8:00 AM', night: '8:00 PM' }, duration: '30', dosage: '1 tablet', instructions: 'After food', quantity: 60 }
      ]
    },
    bloodPressure: {
      keywords: ['blood pressure', 'hypertension', 'high bp', 'bp high', 'heart pressure'],
      response: "For blood pressure management, I recommend:\n\nMedicines:\n- Tab. Amlodipine 5mg - 1 tablet daily\n- Tab. Lisinopril 5mg - 1 tablet daily\n\nAdvice:\n- Reduce salt intake\n- Avoid fried foods\n- Exercise regularly\n- Monitor BP daily\n\nIMPORTANT: Consult a cardiologist for proper BP management!",
      medicines: [
        { name: 'Amlodipine 5mg', timing: { morning: '8:00 AM' }, duration: '30', dosage: '1 tablet', instructions: 'After food', quantity: 30 }
      ]
    },
    eye: {
      keywords: ['eye pain', 'eye problem', 'red eye', 'eye infection', 'vision', 'blur vision'],
      response: "For eye problems, I recommend:\n\nMedicines:\n- Eye Drop. Refresh Tears - 2 drops 3 times daily\n- Eye Drop. Ciprofloxacin - 2 drops 4 times daily\n\nAdvice:\n- Don't rub your eyes\n- Use clean water to wash eyes\n- Avoid screen strain\n- Wear sunglasses outdoors\n\nConsult an eye specialist if persists!",
      medicines: [
        { name: 'Refresh Tears Eye Drop', timing: { morning: '8:00 AM', afternoon: '2:00 PM', night: '8:00 PM' }, duration: '7', dosage: '2 drops', instructions: 'In both eyes', quantity: 1 },
        { name: 'Ciprofloxacin Eye Drop', timing: { morning: '8:00 AM', afternoon: '2:00 PM', night: '8:00 PM', evening: '6:00 PM' }, duration: '7', dosage: '2 drops', instructions: 'In affected eye', quantity: 1 }
      ]
    },
    skin: {
      keywords: ['skin problem', 'skin infection', 'pimples', 'acne', 'wound', 'cut'],
      response: "For skin problems, I recommend:\n\nMedicines:\n- Cream. Clindamycin - Apply twice daily\n- Cream. Mupirocin - Apply on wound\n- Tab. Doxycycline 100mg - 1 tablet twice daily (for acne)\n\nAdvice:\n- Keep affected area clean\n- Don't scratch or pop pimples\n- Use mild soap\n- Avoid oily foods\n\nConsult a dermatologist if severe!",
      medicines: [
        { name: 'Clindamycin Cream', timing: { morning: '8:00 AM', night: '8:00 PM' }, duration: '14', dosage: 'Apply cream', instructions: 'On affected area', quantity: 1 }
      ]
    }
  };

  const checkEmergency = (text) => {
    const emergencyKeywords = ['chest pain', 'heart attack', 'breathing', 'bleeding', 'unconscious', 'severe', 'emergency', 'cannot breathe', 'blood loss'];
    return emergencyKeywords.some(k => text.toLowerCase().includes(k));
  };

  const findSymptom = (text) => {
    const lowerText = text.toLowerCase();
    for (const [, data] of Object.entries(symptomDatabase)) {
      if (data.keywords.some(k => lowerText.includes(k))) {
        return data;
      }
    }
    return null;
  };

  useEffect(() => {
    // Don't auto-start - wait for user to speak first
    initSpeechRecognition();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }

        if (finalTranscript.trim()) {
          setPatientInput(finalTranscript.trim());
          // Auto-send the message when voice input is complete
          setTimeout(() => {
            handleVoiceMessage(finalTranscript.trim());
          }, 500);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  };

  // Handle voice message - user speaks first, then AI responds
  const handleVoiceMessage = async (text) => {
    if (!text.trim()) return;
    
    // Start conversation if not started
    if (!conversationStarted) {
      setConversationStarted(true);
    }

    const userMessage = {
      id: Date.now(),
      speaker: 'patient',
      text: text,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setPatientInput('');
    setIsAIThinking(true);

    if (checkEmergency(text)) {
      setIsAIThinking(false);
      const emergencyMsg = {
        id: Date.now() + 1,
        speaker: 'doctor',
        text: "⚠️ EMERGENCY DETECTED!\n\nThis sounds serious. Please:\n\n1. Call emergency services (108) immediately\n2. Visit your nearest hospital\n3. Don't wait - act fast!\n\nYour health is important!",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, emergencyMsg]);
      return;
    }

    // Get AI response based on user's symptoms
    const aiResponse = await callGroqAPI(text);
    setIsAIThinking(false);

    const doctorMessage = {
      id: Date.now() + 1,
      speaker: 'doctor',
      text: aiResponse,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, doctorMessage]);
  };

  const startConsultation = () => {
    // DON'T show greeting - just start listening for user input
    setConversationStarted(true);
  };

  const handleStartWithVoice = () => {
    // Start conversation and begin listening
    if (!conversationStarted) {
      startConsultation();
    }
    // Start voice recognition
    if (!isListening) {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Start conversation first if not started
      if (!conversationStarted) {
        startConsultation();
      }
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const callGroqAPI = async (userMessage) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are Dr. AI Assistant, a helpful medical AI at Unity Health Hub specializing in healthcare and wellness. IMPORTANT: 1. ONLY provide health and medical-related advice 2. NEVER say "sorry" - provide constructive help instead 3. NEVER discuss relationships or non-medical topics 4. Always be encouraging about health matters 5. Provide practical, actionable medical advice 6. Ask follow-up symptoms questions if needed. Keep responses under 150 words.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API Error:', error);
      return getAIResponse(userMessage, doctorInfo.specialization);
    }
  };

  const handleSendMessage = async () => {
    const text = patientInput.trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      speaker: 'patient',
      text: text,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setPatientInput('');
    setIsAIThinking(true);

    if (checkEmergency(text)) {
      setIsAIThinking(false);
      const emergencyMsg = {
        id: Date.now() + 1,
        speaker: 'doctor',
        text: "⚠️ EMERGENCY DETECTED!\n\nThis sounds serious. Please:\n\n1. Call emergency services (108) immediately\n2. Visit your nearest hospital\n3. Don't wait - act fast!\n\nYour health is important!",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, emergencyMsg]);
      return;
    }

    const aiResponse = await callGroqAPI(text);
    setIsAIThinking(false);

    const doctorMessage = {
      id: Date.now() + 1,
      speaker: 'doctor',
      text: aiResponse,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, doctorMessage]);
  };

  const handleGeneratePrescription = () => {
    setIsGeneratingPrescription(true);
    
    const generatingMsg = {
      id: Date.now() + 1,
      speaker: 'doctor',
      text: "🔄 Analyzing your symptoms and generating personalized prescription...\n\nPlease wait while our AI processes your information...",
      timestamp: new Date().toLocaleTimeString(),
      isGenerating: true
    };
    setMessages(prev => [...prev, generatingMsg]);

    // 5 second delay as requested - user can see the generation process
    setTimeout(() => {
      const lastPatientMsg = [...messages].reverse().find(m => m.speaker === 'patient');
      let symptomData = null;

      if (lastPatientMsg) {
        symptomData = findSymptom(lastPatientMsg.text);
      }

      if (!symptomData) {
        symptomData = symptomDatabase.fever;
      }

      const newPrescription = {
        doctorName: doctorInfo.name,
        specialization: doctorInfo.specialization,
        hospital: doctorInfo.hospital,
        prescription: {
          medicines: symptomData.medicines || [],
          advice: symptomData.response.split('\n').filter(line => line.startsWith('Advice:')),
          date: new Date().toLocaleDateString(),
          fee: '₹200'
        }
      };

      setPrescription(newPrescription);
      setShowPrescription(true);
      setIsGeneratingPrescription(false);

      const successMsg = {
        id: Date.now() + 2,
        speaker: 'doctor',
        text: "✅ Your prescription has been generated successfully!\n\nConsultation Fee: ₹200\n\nYou can download your prescription or add medicines to your medication reminder. Take care and get well soon!",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, successMsg]);
      setShowOkButton(true);
    }, 5000); // 5 seconds as requested
  };

  const handleDownloadReceipt = () => {
    if (!prescription) return;

    let medList = '';
    prescription.prescription.medicines.forEach((med, idx) => {
      medList += `${idx + 1}. ${med.name}\n`;
      medList += `   Dosage: ${med.dosage}\n`;
      medList += `   Duration: ${med.duration} days\n`;
      if (med.timing?.morning) medList += `   Morning: ${med.timing.morning}\n`;
      if (med.timing?.afternoon) medList += `   Afternoon: ${med.timing.afternoon}\n`;
      if (med.timing?.evening) medList += `   Evening: ${med.timing.evening}\n`;
      if (med.timing?.night) medList += `   Night: ${med.timing.night}\n`;
      medList += `   Instructions: ${med.instructions || 'None'}\n\n`;
    });

    const receiptContent = `=====================================
     ${prescription.doctorName}
     ${prescription.specialization}
     ${prescription.hospital}
=====================================

DATE: ${new Date().toLocaleDateString()}

PRESCRIBED MEDICINES:
${medList}
=====================================
Please consult a real doctor.
=====================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddSingleMedicine = (medicine) => {
    const medicineData = {
      name: medicine.name,
      dosage: medicine.dosage,
      duration: medicine.duration,
      timing: medicine.timing,
      instructions: medicine.instructions,
      quantity: medicine.quantity
    };

    const existing = localStorage.getItem('aiPrescriptionMedicines');
    let medicines = existing ? JSON.parse(existing) : [];
    medicines.push(medicineData);
    localStorage.setItem('aiPrescriptionMedicines', JSON.stringify(medicines));
    
    alert(`✅ ${medicine.name} added to Medicine Reminder!\n\nGo to Medicine Reminder to set up schedule.`);
  };

  const handleAddToMedicationReminder = () => {
    if (!prescription || !prescription.prescription.medicines) return;
    
    const existing = localStorage.getItem('aiPrescriptionMedicines');
    let medicines = existing ? JSON.parse(existing) : [];
    
    prescription.prescription.medicines.forEach(med => {
      medicines.push({
        name: med.name,
        dosage: med.dosage,
        duration: med.duration,
        timing: med.timing,
        instructions: med.instructions,
        quantity: med.quantity
      });
    });
    
    localStorage.setItem('aiPrescriptionMedicines', JSON.stringify(medicines));
    alert(`✅ All ${prescription.prescription.medicines.length} medicines added to Medicine Reminder!`);
  };

  const handleOkButton = () => {
    setShowOkButton(false);
    // Navigate to Medicine Reminder section - close AI Doctor and open Medication Reminder
    if (onNavigateToMedicines) {
      onNavigateToMedicines();
    }
    // Also close current view and open medication reminder directly
    onEndConsultation();
  };

  const handleEndCall = () => {
    onEndConsultation();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Show start screen when conversation hasn't started
  if (!conversationStarted) {
    return (
      <div className="ai-doctor-container">
        <div className="ai-doctor-header">
          <div className="ai-doctor-info">
            <div className="ai-avatar">
              <FaRobot />
            </div>
            <div className="ai-info">
              <h2>{doctorInfo.name}</h2>
              <span className="doctor-specialization">{doctorInfo.specialization} | {doctorInfo.hospital}</span>
              <span className="status ready">Tap to start speaking</span>
            </div>
          </div>
          <button className="end-call-btn" onClick={handleEndCall}>
            <FaTimes /> End
          </button>
        </div>

        <div className="ai-doctor-content">
          <div className="conversation-panel">
            <div className="start-screen">
              <div className="start-avatar">
                <FaRobot />
              </div>
              <h2>Welcome to AI Doctor</h2>
              <p>Tell me about your symptoms and I'll help you with medical advice</p>
              
              <button 
                className="start-voice-btn"
                onClick={handleStartWithVoice}
              >
                <FaMicrophone />
                <span>Tap to Speak</span>
              </button>
              
              <p className="start-hint">
                Or type your symptoms in the box below
              </p>
              
              <div className="input-section">
                <input
                  type="text"
                  value={patientInput}
                  onChange={(e) => setPatientInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && patientInput.trim()) {
                      if (!conversationStarted) {
                        startConsultation();
                      }
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your symptoms here..."
                  className="patient-input"
                />
                <button
                  className="send-btn"
                  onClick={() => {
                    if (patientInput.trim()) {
                      if (!conversationStarted) {
                        startConsultation();
                      }
                      handleSendMessage();
                    }
                  }}
                  disabled={!patientInput.trim()}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-doctor-container">
      <div className="ai-doctor-header">
        <div className="ai-doctor-info">
          <div className="ai-avatar">
            <FaRobot />
          </div>
          <div className="ai-info">
            <h2>{doctorInfo.name}</h2>
            <span className="doctor-specialization">{doctorInfo.specialization} | {doctorInfo.hospital}</span>
            <span className="status ready">Ready to help</span>
          </div>
        </div>
        <button className="end-call-btn" onClick={handleEndCall}>
          <FaTimes /> End
        </button>
      </div>

      <div className="ai-doctor-content">
        <div className="conversation-panel">
          <div className="messages-container">
            {messages.map((msg) => (
              !msg.isGenerating && (
                <div key={msg.id} className={`message ${msg.speaker}`}>
                  <div className="message-icon">
                    {msg.speaker === 'doctor' ? <FaRobot /> : <FaUser />}
                  </div>
                  <div className="message-content">
                    <p>{msg.text}</p>
                  </div>
                </div>
              )
            ))}

            {isAIThinking && (
              <div className="message doctor">
                <div className="message-icon">
                  <FaRobot />
                </div>
                <div className="message-content">
                  <p>🤔 Analyzing your symptoms...</p>
                </div>
              </div>
            )}

            {messages.length >= 2 && !showPrescription && (
              <div className="prescription-prompt">
                <button 
                  className="btn btn-primary" 
                  onClick={handleGeneratePrescription}
                  disabled={isGeneratingPrescription}
                >
                  {isGeneratingPrescription ? 'Generating...' : 'Generate Prescription'}
                </button>
              </div>
            )}

            {isGeneratingPrescription && (
              <div className="generating-animation">
                <div className="loading-spinner"></div>
                <p className="generating-text">🔄 Generating Prescription...</p>
                <p className="generating-subtext">Analyzing symptoms and creating treatment plan</p>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            )}

            {showOkButton && (
              <div className="ok-button-container">
                <button className="btn btn-ok" onClick={handleOkButton}>
                  <FaCheckCircle /> OK
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="input-section">
            <button
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop Recording' : 'Start Voice Input'}
            >
              {isListening ? <FaStop /> : <FaMicrophone />}
            </button>
            <input
              type="text"
              value={patientInput}
              onChange={(e) => setPatientInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? 'Listening...' : 'Type or speak your symptoms...'}
              className="patient-input"
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!patientInput.trim() || isAIThinking}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>

        {showPrescription && prescription && (
          <div className="prescription-panel">
            <div className="prescription-header">
              <h3>Prescription</h3>
              <div className="doctor-info-mini">
                <strong>{prescription.doctorName}</strong>
                <span>{prescription.specialization}</span>
                <span>{prescription.hospital}</span>
              </div>
            </div>

            <div className="consultation-fee-banner">
              <div className="fee-icon">💳</div>
              <div className="fee-details">
                <span className="fee-label">Consultation Fee</span>
                <span className="fee-amount">{prescription.prescription.fee || '₹200'}</span>
              </div>
            </div>

            <div className="medicines-section">
              <h4>Medicines</h4>
              {prescription.prescription.medicines && prescription.prescription.medicines.map((med, idx) => (
                <div key={idx} className="medicine-card">
                  <div className="med-name">
                    <FaBell /> {med.name}
                  </div>
                  <div className="med-details">
                    <span>Dosage: {med.dosage}</span>
                    <span>Duration: {med.duration} days</span>
                  </div>
                  <div className="timing-section">
                    <h5>Timings:</h5>
                    <div className="timing-grid">
                      {med.timing?.morning && (
                        <div className="timing-item morning">🌅 {med.timing.morning}</div>
                      )}
                      {med.timing?.afternoon && (
                        <div className="timing-item afternoon">☀️ {med.timing.afternoon}</div>
                      )}
                      {med.timing?.evening && (
                        <div className="timing-item evening">🌆 {med.timing.evening}</div>
                      )}
                      {med.timing?.night && (
                        <div className="timing-item night">🌙 {med.timing.night}</div>
                      )}
                    </div>
                  </div>
                  {med.instructions && (
                    <div className="med-instructions">
                      {med.instructions}
                    </div>
                  )}
                  <button 
                    className="btn-add-single-med"
                    onClick={() => handleAddSingleMedicine(med)}
                  >
                    <FaPlus /> Add to Reminder
                  </button>
                </div>
              ))}
            </div>

            <div className="prescription-actions">
              <button className="btn btn-download" onClick={handleDownloadReceipt}>
                <FaDownload /> Download Prescription
              </button>
              <button
                className="btn btn-add-reminder"
                onClick={handleAddToMedicationReminder}
              >
                <FaPlus /> Add to Medication Reminder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDoctor;
