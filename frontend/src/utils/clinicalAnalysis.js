// Local AI Clinical Analysis Engine
// Generates clinical analysis from conversation transcripts

export const generateClinicalAnalysis = (transcripts) => {
  const patientMessages = transcripts
    .filter(t => t.speaker === 'patient')
    .map(t => t.text.toLowerCase())
    .join(' ');

  const symptoms = extractSymptoms(patientMessages);
  const severity = assessSeverity(symptoms, patientMessages);
  const diagnosis = suggestDiagnosis(symptoms, severity);
  const medications = recommendMedications(symptoms, diagnosis, severity);
  const riskFactors = identifyRiskFactors(patientMessages);
  const redFlags = detectRedFlags(symptoms, patientMessages);

  return {
    symptoms_identified: symptoms,
    severity_level: severity,
    risk_factors: riskFactors,
    suggested_diagnosis: diagnosis,
    medication_recommendations: medications,
    red_flags: redFlags,
    requires_physical_exam: severity === 'high' || severity === 'critical',
    requires_emergency_care: severity === 'critical' || redFlags.length > 0
  };
};

const extractSymptoms = (text) => {
  const symptoms = [];
  const symptomKeywords = {
    'fever': ['fever', 'temperature', 'hot', 'burning'],
    'cough': ['cough', 'coughing'],
    'cold': ['cold', 'runny nose', 'sneezing'],
    'headache': ['headache', 'head pain', 'migraine'],
    'fatigue': ['tired', 'fatigue', 'exhausted', 'weakness', 'weak'],
    'shortness of breath': ['breath', 'breathing', 'breathless', 'dyspnea'],
    'chest pain': ['chest pain', 'chest hurt'],
    'sore throat': ['sore throat', 'throat pain'],
    'body aches': ['body ache', 'muscle pain', 'joint pain'],
    'nausea': ['nausea', 'nauseous', 'sick'],
    'vomiting': ['vomit', 'vomiting', 'throw up'],
    'diarrhea': ['diarrhea', 'loose stool'],
    'stomach pain': ['stomach pain', 'abdominal pain', 'belly pain'],
    'dizziness': ['dizzy', 'dizziness', 'lightheaded'],
    'chills': ['chills', 'shivering'],
    'sweating': ['sweating', 'sweat'],
    'loss of appetite': ['no appetite', 'not hungry'],
    'rash': ['rash', 'skin rash'],
    'itching': ['itch', 'itching', 'itchy'],
    'swelling': ['swelling', 'swollen'],
    'back pain': ['back pain', 'backache'],
    'insomnia': ['sleep', 'insomnia', 'cant sleep']
  };

  for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      symptoms.push(symptom);
    }
  }

  return symptoms.length > 0 ? symptoms : ['general discomfort'];
};

const assessSeverity = (symptoms, text) => {
  const criticalSymptoms = ['chest pain', 'shortness of breath', 'severe bleeding'];
  const highSymptoms = ['high fever', 'severe pain', 'difficulty breathing'];
  
  if (symptoms.some(s => criticalSymptoms.includes(s)) || text.includes('severe') || text.includes('emergency')) {
    return 'critical';
  }
  
  if (symptoms.length >= 5 || symptoms.some(s => highSymptoms.includes(s)) || text.includes('very')) {
    return 'high';
  }
  
  if (symptoms.length >= 3) {
    return 'moderate';
  }
  
  return 'low';
};

const suggestDiagnosis = (symptoms, severity) => {
  const diagnoses = [];
  
  const hasFever = symptoms.some(s => s.includes('fever'));
  const hasCough = symptoms.some(s => s.includes('cough'));
  const hasBreathing = symptoms.some(s => s.includes('breath'));
  const hasStomach = symptoms.some(s => s.includes('stomach') || s.includes('nausea') || s.includes('vomit'));
  const hasHeadache = symptoms.some(s => s.includes('headache'));
  const hasFatigue = symptoms.some(s => s.includes('fatigue'));
  
  if (hasFever && hasCough) {
    diagnoses.push('Upper Respiratory Tract Infection');
    diagnoses.push('Viral Fever');
    if (hasBreathing) diagnoses.push('Bronchitis');
  }
  
  if (hasFever && hasStomach) {
    diagnoses.push('Gastroenteritis');
    diagnoses.push('Food Poisoning');
  }
  
  if (hasHeadache && hasFever) {
    diagnoses.push('Viral Infection');
    diagnoses.push('Flu');
  }
  
  if (hasFatigue && !hasFever) {
    diagnoses.push('Chronic Fatigue');
    diagnoses.push('Anemia');
  }
  
  if (hasStomach && !hasFever) {
    diagnoses.push('Indigestion');
    diagnoses.push('Acid Reflux');
  }
  
  if (diagnoses.length === 0) {
    diagnoses.push('Common Cold');
    diagnoses.push('Viral Infection');
  }
  
  return diagnoses.slice(0, 3);
};

const recommendMedications = (symptoms, diagnosis, severity) => {
  const medications = [];
  
  // Always include basic medications
  const hasFever = symptoms.some(s => s.includes('fever'));
  const hasCough = symptoms.some(s => s.includes('cough'));
  const hasPain = symptoms.some(s => s.includes('pain') || s.includes('ache'));
  const hasStomach = symptoms.some(s => s.includes('stomach') || s.includes('nausea'));
  const hasAllergy = symptoms.some(s => s.includes('rash') || s.includes('itch'));
  const hasCold = symptoms.some(s => s.includes('cold') || s.includes('runny'));
  
  // Fever medications
  if (hasFever) {
    medications.push('Paracetamol 500mg (1 tablet every 6 hours as needed)');
    medications.push('Ibuprofen 400mg (1 tablet every 8 hours with food)');
  }
  
  // Cough medications
  if (hasCough) {
    medications.push('Dextromethorphan Cough Syrup (10ml three times daily)');
    medications.push('Ambroxol 30mg (1 tablet three times daily)');
  }
  
  // Pain medications
  if (hasPain) {
    medications.push('Diclofenac 50mg (1 tablet twice daily after meals)');
    if (!hasFever) {
      medications.push('Paracetamol 650mg (1 tablet when needed)');
    }
  }
  
  // Stomach medications
  if (hasStomach) {
    medications.push('Omeprazole 20mg (1 capsule before breakfast)');
    medications.push('Ondansetron 4mg (1 tablet for nausea)');
    medications.push('Oral Rehydration Solution (ORS) - 1 sachet in 1L water');
  }
  
  // Allergy medications
  if (hasAllergy) {
    medications.push('Cetirizine 10mg (1 tablet at bedtime)');
    medications.push('Hydrocortisone Cream 1% (apply twice daily)');
  }
  
  // Cold medications
  if (hasCold) {
    medications.push('Phenylephrine Nasal Drops (2 drops each nostril)');
    medications.push('Loratadine 10mg (1 tablet once daily)');
  }
  
  // Antibiotics for severe cases
  if (severity === 'high' || severity === 'critical') {
    medications.push('Azithromycin 500mg (1 tablet daily for 3 days - prescription required)');
    medications.push('Amoxicillin 500mg (1 capsule three times daily - prescription required)');
  }
  
  // Vitamins and supplements
  medications.push('Vitamin C 500mg (1 tablet daily)');
  medications.push('Zinc 50mg (1 tablet daily)');
  medications.push('Multivitamin (1 tablet daily)');
  
  // General advice
  medications.push('Rest and adequate sleep (7-8 hours)');
  medications.push('Drink plenty of fluids (2-3 liters water daily)');
  medications.push('Warm salt water gargle (if sore throat)');
  
  // Ensure we have 4-13 medications
  if (medications.length < 4) {
    medications.push('Probiotics (1 capsule daily)');
    medications.push('Steam inhalation (twice daily)');
    medications.push('Honey and ginger tea (as needed)');
    medications.push('Balanced diet with fruits and vegetables');
  }
  
  // Return 4-13 medications
  return medications.slice(0, 13);
};

const identifyRiskFactors = (text) => {
  const riskFactors = [];
  
  if (text.includes('smoke') || text.includes('smoking')) {
    riskFactors.push('Smoking history');
  }
  if (text.includes('diabetes')) {
    riskFactors.push('Diabetes');
  }
  if (text.includes('hypertension') || text.includes('blood pressure')) {
    riskFactors.push('Hypertension');
  }
  if (text.includes('asthma')) {
    riskFactors.push('Asthma');
  }
  if (text.includes('heart') && text.includes('disease')) {
    riskFactors.push('Cardiovascular disease');
  }
  if (text.includes('pregnant') || text.includes('pregnancy')) {
    riskFactors.push('Pregnancy');
  }
  if (text.includes('elderly') || text.includes('old age')) {
    riskFactors.push('Advanced age');
  }
  
  return riskFactors;
};

const detectRedFlags = (symptoms, text) => {
  const redFlags = [];
  
  if (symptoms.includes('chest pain')) {
    redFlags.push('Chest pain - requires immediate evaluation');
  }
  if (symptoms.includes('shortness of breath') && text.includes('severe')) {
    redFlags.push('Severe breathing difficulty');
  }
  if (text.includes('blood') && (text.includes('cough') || text.includes('vomit'))) {
    redFlags.push('Hemoptysis or hematemesis');
  }
  if (text.includes('unconscious') || text.includes('faint')) {
    redFlags.push('Loss of consciousness');
  }
  if (text.includes('seizure')) {
    redFlags.push('Seizure activity');
  }
  
  return redFlags;
};
