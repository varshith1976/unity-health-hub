const express = require('express');
const router = express.Router();

// Emergency keywords
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart pain', 'palpitation', 'heart attack',
  'breathing problem', 'breathlessness', 'shortness of breath', 'cannot breathe',
  'heavy bleeding', 'bleeding non-stop', 'blood loss',
  'unconscious', 'unresponsive', 'fainted', 'collapsed',
  'severe headache', 'sudden severe pain', 'extreme pain',
  'high fever', 'very high temperature', 'seizure', 'convulsion'
];

// Check if emergency
const isEmergency = (message) => {
  const lowerMessage = message.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

// Detect symptoms
const detectSymptoms = (message) => {
  const lowerMessage = message.toLowerCase();
  const symptoms = [];
  
  if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || lowerMessage.includes('hot')) {
    symptoms.push('Fever');
  }
  if (lowerMessage.includes('cold') || lowerMessage.includes('running nose') || lowerMessage.includes('nasal')) {
    symptoms.push('Cold');
  }
  if (lowerMessage.includes('cough') || lowerMessage.includes('coughing')) {
    symptoms.push('Cough');
  }
  if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
    symptoms.push('Headache');
  }
  if (lowerMessage.includes('stomach') || lowerMessage.includes('belly') || lowerMessage.includes('abdominal')) {
    symptoms.push('Stomach Pain');
  }
  if (lowerMessage.includes('body pain') || lowerMessage.includes('body ache') || lowerMessage.includes('muscle')) {
    symptoms.push('Body Pain');
  }
  if (lowerMessage.includes('vomit') || lowerMessage.includes('throw up')) {
    symptoms.push('Vomiting');
  }
  if (lowerMessage.includes('diarrhea') || lowerMessage.includes('loose motion') || lowerMessage.includes('watery stool')) {
    symptoms.push('Diarrhea');
  }
  if (lowerMessage.includes('throat') || lowerMessage.includes('sore throat')) {
    symptoms.push('Sore Throat');
  }
  if (lowerMessage.includes('dizzy') || lowerMessage.includes('dizziness') || lowerMessage.includes('lightheaded')) {
    symptoms.push('Dizziness');
  }
  
  return symptoms;
};

// Get advice based on symptoms
const getAdvice = (symptoms) => {
  const advice = {
    'Fever': ['Drink plenty of water', 'Take rest', 'Take paracetamol if needed', 'Consult doctor if fever lasts more than 3 days'],
    'Cold': ['Drink warm water', 'Get plenty of rest', 'Use steam inhalation', 'Take vitamin C'],
    'Cough': ['Drink warm water', 'Take honey (if not diabetic)', 'Avoid cold drinks', 'Consult doctor if cough lasts more than a week'],
    'Headache': ['Rest in a quiet room', 'Drink water', 'Avoid screen time', 'Take paracetamol if needed'],
    'Stomach Pain': ['Avoid spicy food', 'Drink warm water', 'Take light meals', 'Consult doctor if severe'],
    'Body Pain': ['Rest properly', 'Apply warm compress', 'Take pain reliever', 'Massage gently'],
    'Vomiting': ['Drink ORS solution', 'Start with light food', 'Avoid dairy', 'Consult doctor if persists'],
    'Diarrhea': ['Drink plenty of fluids', 'Eat bland food', 'Avoid dairy', 'Take ORS'],
    'Sore Throat': ['Gargle with warm salt water', 'Drink warm liquids', 'Avoid cold drinks', 'Take honey'],
    'Dizziness': ['Sit or lie down immediately', 'Drink water', 'Avoid sudden movements', 'Consult doctor if frequent']
  };
  
  let allAdvice = [];
  symptoms.forEach(symptom => {
    if (advice[symptom]) {
      allAdvice = [...allAdvice, ...advice[symptom]];
    }
  });
  
  return [...new Set(allAdvice)].slice(0, 4);
};

// Get home remedy
const getHomeRemedy = (symptoms) => {
  const remedies = {
    'Fever': 'Mix 1 tsp ginger juice with honey. Take twice daily. Or drink tulsi tea.',
    'Cough': 'Mix 1 tsp honey with black pepper powder. Take twice daily.',
    'Cold': 'Drink warm water with lemon and honey. Inhale steam.',
    'Headache': 'Apply lemon juice on forehead. Rest in dark room.',
    'Stomach Pain': 'Drink warm water with ajwain. Apply hot compress on belly.',
    'Body Pain': 'Apply turmeric and sesame oil paste on affected area.',
    'Sore Throat': 'Gargle with warm salt water 3 times a day.',
    'Diarrhea': 'Drink ORS solution. Eat banana and rice water.'
  };
  
  for (const symptom of symptoms) {
    if (remedies[symptom]) {
      return remedies[symptom];
    }
  }
  return null;
};

// Doctor info
const doctorInfo = {
  name: 'Dr. Sarah Johnson',
  specialization: 'General Physician',
  hospital: 'Unity Health Hub',
  experience: '15 years',
  qualifications: 'MBBS, MD'
};

// Intro message
const getIntroMessage = () => {
  return `Hello! 😊 I'm ${doctorInfo.name}, a ${doctorInfo.specialization} at ${doctorInfo.hospital}.\n\nI have ${doctorInfo.experience} of experience in treating patients. I'm here to help you with your health concerns!\n\nPlease tell me about your symptoms - what's bothering you today?`;
};

// Chat endpoint
router.post('/chat', async (req, res) => {
  const { message, isIntro } = req.body;
  
  // Return intro message if requested
  if (isIntro) {
    return res.json({ 
      response: getIntroMessage(),
      isEmergency: false,
      symptoms: [],
      isIntro: true
    });
  }
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  const detectedSymptoms = detectSymptoms(message);
  const emergencyDetected = isEmergency(message);
  
  // If no API key, use local response
  if (!groqApiKey) {
    let response = '';
    
    if (emergencyDetected) {
      response = `⚠️ EMERGENCY CASE DETECTED!\n\n`;
      response += `Your symptoms sound serious. Please visit a nearby hospital or call emergency services immediately.\n\n`;
      response += `Please consult a real doctor or visit a nearby hospital.`;
      
      return res.json({ 
        response,
        isEmergency: true,
        symptoms: detectedSymptoms
      });
    }
    
    if (detectedSymptoms.length > 0) {
      const advice = getAdvice(detectedSymptoms);
      const remedy = getHomeRemedy(detectedSymptoms);
      
      response = `Hello 🙂\n\n`;
      response += `Symptoms: • ${detectedSymptoms.join('\n• ')}\n\n`;
      response += `Advice:\n`;
      advice.forEach((a, i) => {
        response += `• ${a}\n`;
      });
      
      if (remedy) {
        response += `\n🌿 Home Remedy:\n${remedy}\n`;
      }
      
      response += `\nPlease consult a real doctor or visit a nearby hospital.`;
    } else {
      response = `Hello! 🙂\n\nI'm your virtual doctor assistant. I can help with fever, cold, cough, headache, stomach pain, and more.\n\nPlease tell me about your symptoms!`;
    }
    
    return res.json({ 
      response,
      isEmergency: emergencyDetected,
      symptoms: detectedSymptoms
    });
  }

  // Use Groq API
  const systemPrompt = `You are ${doctorInfo.name}, a ${doctorInfo.specialization} at ${doctorInfo.hospital} with ${doctorInfo.experience} of experience.

RESPONSIBILITIES:
1. Greet politely
2. Ask questions about symptoms one at a time
3. Explain in SIMPLE English
4. Give basic medical guidance only
5. NEVER prescribe strong medicines (no antibiotics, steroids)
6. Suggest home remedies (homey, ginger, steam, salt water)
7. If serious, say: "Please consult a real doctor or visit a nearby hospital."
8. Be caring and supportive
9. Keep answers SHORT

For emergency (chest pain, breathing problem, heavy bleeding, unconscious):
- Respond URGENTLY

Handle: fever, cold, cough, headache, stomach pain, body pain, etc.

Lifestyle: drink water, rest, eat light food.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      let aiResponse = data.choices[0].message.content;
      
      if (emergencyDetected && !aiResponse.toLowerCase().includes('hospital')) {
        aiResponse += '\n\n⚠️ Please consult a real doctor or visit a nearby hospital.';
      }
      
      res.json({ 
        response: aiResponse,
        isEmergency: emergencyDetected,
        symptoms: detectedSymptoms
      });
    } else {
      res.status(500).json({ error: 'Invalid response from AI' });
    }
  } catch (error) {
    console.error('AI error:', error);
    
    const advice = getAdvice(detectedSymptoms);
    const remedy = getHomeRemedy(detectedSymptoms);
    
    let response = `Hello 🙂\n\n`;
    
    if (emergencyDetected) {
      response = `⚠️ EMERGENCY!\n\nPlease visit a nearby hospital or call emergency services.\n\nPlease consult a real doctor or visit a nearby hospital.`;
    } else if (detectedSymptoms.length > 0) {
      response += `Symptoms: • ${detectedSymptoms.join('\n• ')}\n\nAdvice:\n`;
      advice.forEach((a, i) => response += `• ${a}\n`);
      if (remedie) response += `\n🌿 Home Remedy: ${remedy}\n`;
      response += `\nPlease consult a real doctor or visit a nearby hospital.`;
    } else {
      response += `Please tell me about your symptoms!`;
    }
    
    res.json({ 
      response,
      isEmergency: emergencyDetected,
      symptoms: detectedSymptoms
    });
  }
});

// Generate prescription with tablet timings
router.post('/generate-prescription', async (req, res) => {
  const { symptoms, conversationHistory } = req.body;
  
  const groqApiKey = process.env.GROQ_API_KEY;
  
  const prescription = {
    medicines: [
      {
        name: 'Paracetamol 500mg',
        dosage: '1 tablet',
        frequency: '3 times a day',
        duration: '5 days',
        timing: {
          morning: '8:00 AM',
          afternoon: '2:00 PM',
          evening: '6:00 PM',
          night: '10:00 PM'
        },
        instructions: 'Take after food'
      },
      {
        name: 'Vitamin C 1000mg',
        dosage: '1 tablet',
        frequency: '1 time a day',
        duration: '10 days',
        timing: {
          morning: '8:00 AM',
          afternoon: null,
          evening: null,
          night: null
        },
        instructions: 'Take in the morning with breakfast'
      }
    ],
    advice: [
      'Drink plenty of water (8 glasses daily)',
      'Get proper rest (7-8 hours)',
      'Eat light, healthy food',
      'Avoid cold drinks and junk food'
    ],
    lifestyle: [
      'Maintain proper sleep schedule',
      'Exercise lightly when feeling better',
      'Keep yourself hydrated'
    ]
  };
  
  // If we have API key, use AI to generate better prescription
  if (groqApiKey) {
    const prompt = `Generate a simple prescription based on symptoms: ${symptoms?.mainComplaint || 'General symptoms'}

Only recommend safe medicines like:
- Paracetamol for fever/pain
- Vitamin C supplements
- ORS for dehydration
- Antacids for acidity

NEVER recommend antibiotics or strong medicines.

Return JSON format:
{
  "medicines": [
    {
      "name": "medicine name",
      "dosage": "1 tablet/syrup",
      "frequency": "times per day",
      "duration": "days",
      "timing": {
        "morning": "8:00 AM or null",
        "afternoon": "2:00 PM or null",
        "evening": "6:00 PM or null",
        "night": "10:00 PM or null"
      },
      "instructions": "before/after food"
    }
  ],
  "advice": ["advice1", "advice2"],
  "lifestyle": ["tip1", "tip2"]
}`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'You are a prescription generator. Generate safe prescriptions in JSON format only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        try {
          const prescriptionText = data.choices[0].message.content;
          const jsonMatch = prescriptionText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const aiPrescription = JSON.parse(jsonMatch[0]);
            if (aiPrescription.medicines) {
              return res.json({ 
                success: true,
                prescription: aiPrescription,
                doctorName: doctorInfo.name,
                specialization: doctorInfo.specialization,
                hospital: doctorInfo.hospital
              });
            }
          }
        } catch (parseError) {
          console.log('Parse error, using default prescription');
        }
      }
    } catch (error) {
      console.error('Prescription generation error:', error);
    }
  }
  
  res.json({ 
    success: true,
    prescription,
    doctorName: doctorInfo.name,
    specialization: doctorInfo.specialization,
    hospital: doctorInfo.hospital
  });
});

module.exports = router;
