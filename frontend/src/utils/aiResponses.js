export const getAIResponse = (message, specialization = 'General Physician') => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm your AI health assistant at Unity Health Hub. How can I help you today? You can tell me about any symptoms you're experiencing, health concerns, or ask me medical questions.";
  }
  
  if (lowerMessage.includes('how are you')) {
    return "I'm doing great, thank you for asking! I'm here and ready to help you with any health concerns. How are you feeling today?";
  }
  
  if (lowerMessage.includes('what is your name') || lowerMessage.includes('who are you')) {
    return "I'm Dr. AI Assistant, your virtual health companion at Unity Health Hub! I can help you with: Understanding symptoms, Medication information, Health advice, Treatment recommendations. Just describe your symptoms or ask me anything!";
  }
  
  if (lowerMessage.includes('thank you')) {
    return "You're very welcome! That's what I'm here for. Is there anything else you'd like to know about your health?";
  }
  
  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return "Goodbye! Take care of your health. Don't hesitate to come back if you have any more questions. Stay healthy!";
  }
  
  if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || lowerMessage.includes('hot body')) {
    return "For Fever: Tab. Paracetamol 500mg - 1 tablet when needed (max 4/day), Tab. Vitamin C 1000mg - 1 tablet daily. Home Advice: Drink plenty of water (8+ glasses), Get rest, Sponge with lukewarm water, Avoid cold drinks. Consult doctor if fever persists beyond 3 days!";
  }
  
  if (lowerMessage.includes('cough') || lowerMessage.includes('cold') || lowerMessage.includes('flu') || lowerMessage.includes('runny nose') || lowerMessage.includes('sneezing') || lowerMessage.includes('sore throat')) {
    return "For Cold/Cough: Tab. Cetrizine 10mg - 1 tablet at night, Syrup. Alex - 1 tsp 3 times daily, Tab. Vitamin C 1000mg daily. Home Remedies: Drink warm water with lemon and honey, Get rest, Steam inhalation, Avoid cold drinks. Most colds improve in 5-7 days.";
  }
  
  if (lowerMessage.includes('headache') || lowerMessage.includes('head pain') || lowerMessage.includes('migraine')) {
    return "For Headache: Tab. Paracetamol 500mg - when needed, Tab. Ibuprofen 400mg - after food if severe. Quick Relief: Rest in quiet dark room, Drink water (dehydration causes headaches!), Avoid screen time, Cold compress on temples. Seek urgent care if severe with fever!";
  }
  
  if (lowerMessage.includes('stomach pain') || lowerMessage.includes('belly pain') || lowerMessage.includes('abdominal') || lowerMessage.includes('gas') || lowerMessage.includes('acidity')) {
    return "For Stomach Issues: Tab. Pantocid 40mg - on empty stomach, Tab. Digene - after meals, Tab. Domstal 10mg - before food. Diet: Avoid spicy food, Drink warm water, Eat light meals, Don't eat fast. Go to hospital if severe pain or vomiting!";
  }
  
  if (lowerMessage.includes('vomit') || lowerMessage.includes('throwing up') || lowerMessage.includes('nausea') || lowerMessage.includes('feeling sick')) {
    return "For Vomiting/Nausea: Tab. Ondansetron 4mg - when needed, Tab. Domstal 10mg - before food, ORS solution - 1 packet in 1 liter water. Relief: Sip ORS slowly, Start light food (rice, banana), Avoid dairy. Go to hospital if blood in vomit!";
  }
  
  if (lowerMessage.includes('diarrhea') || lowerMessage.includes('loose motion') || lowerMessage.includes('watery stool')) {
    return "For Diarrhea: Oflox 200mg - twice daily, ORS solution - 1 liter water, Tab. Loperamide 2mg - after each stool (max 8). Diet: Drink fluids, Eat bland food (rice, banana, toast), Avoid dairy. Consult doctor if lasts over 3 days!";
  }
  
  if (lowerMessage.includes('body pain') || lowerMessage.includes('body ache') || lowerMessage.includes('muscle pain')) {
    return "For Body Pain: Tab. Ibuprofen 400mg - after food when needed, Tab. Aceclofenac 100mg - twice daily, Gel. Volini - apply on affected area. Care: Rest, Warm compress, Gentle massage. Consult doctor if persists over a week!";
  }
  
  if (lowerMessage.includes('back pain') || lowerMessage.includes('lower back')) {
    return "For Back Pain: Tab. Ibuprofen 400mg - when needed, Gel. Volini - apply on back. Tips: Maintain posture, Don't sit long, Use supportive chair, Sleep on firm mattress. Consult orthopedic if severe!";
  }
  
  if (lowerMessage.includes('dizzy') || lowerMessage.includes('dizziness') || lowerMessage.includes('vertigo') || lowerMessage.includes('lightheaded')) {
    return "For Dizziness: Tab. Stugeron 25mg - thrice daily, Tab. Betahistine 16mg - thrice daily. Actions: Sit/lie down immediately, Drink water, Avoid sudden movements, Don't drive. Consult doctor if frequent!";
  }
  
  if (lowerMessage.includes('allergy') || lowerMessage.includes('allergic') || lowerMessage.includes('rash') || lowerMessage.includes('itching')) {
    return "For Allergy: Tab. Cetrizine 10mg - at night, Tab. Fexofenadine 180mg - daily, Lotion. Calamine - apply on rash. Prevention: Avoid allergens, Wear cotton clothes, Don't scratch, Keep skin moisturized. Consult doctor if severe!";
  }
  
  if (lowerMessage.includes('skin problem') || lowerMessage.includes('skin infection') || lowerMessage.includes('pimples') || lowerMessage.includes('acne')) {
    return "For Skin Issues: Cream. Clindamycin - twice daily, Cream. Mupirocin - on wounds, Cream. Calamine - for itching. Care: Keep clean, Don't pop pimples, Use mild soap. Consult dermatologist if spreading!";
  }
  
  if (lowerMessage.includes('diabetes') || lowerMessage.includes('sugar') || lowerMessage.includes('blood sugar') || lowerMessage.includes('glucose')) {
    return "For Diabetes: Tab. Metformin 500mg - twice daily, Tab. Glimepride 1mg - daily (as per doctor). Lifestyle: Check sugar regularly, Avoid sweets, Eat whole grains and vegetables, Exercise 30 mins daily. IMPORTANT: Always consult a doctor!";
  }
  
  if (lowerMessage.includes('blood pressure') || lowerMessage.includes('hypertension') || lowerMessage.includes('high bp')) {
    return "For BP: Tab. Amlodipine 5mg - daily, Tab. Lisinopril 5mg - daily, Tab. Telmisartan 40mg - daily. Lifestyle: Reduce salt, Avoid fried foods, Exercise, Monitor BP. IMPORTANT: Consult cardiologist!";
  }
  
  if (lowerMessage.includes('chest pain') || lowerMessage.includes('heart pain') || lowerMessage.includes('heart attack')) {
    return "CHEST PAIN IS SERIOUS! If experiencing: 1) Call 108 immediately 2) Sit and stay calm 3) Don't exert 4) Take nitroglycerin if available 5) Chew aspirin if not allergic. This could be heart attack - seek immediate medical attention!";
  }
  
  if (lowerMessage.includes('breath') || lowerMessage.includes('breathing') || lowerMessage.includes('asthma') || lowerMessage.includes('lung')) {
    return "For Breathing: Inhaler Salbutamol - as needed, Inhaler Budesonide - daily, Tab. Montelukast 10mg - at night. Relief: Avoid triggers (smoke, dust), Deep breathing, Stay hydrated. Seek care if difficulty breathing at rest!";
  }
  
  if (lowerMessage.includes('eye') || lowerMessage.includes('vision') || lowerMessage.includes('blur') || lowerMessage.includes('red eye')) {
    return "For Eye: Eye Drop Refresh Tears - 2 drops 3 times daily, Eye Drop Ciprofloxacin - 2 drops 4 times daily (infection). Care: Don't rub eyes, Use clean water, Avoid screen strain. Consult eye specialist if persists!";
  }
  
  if (lowerMessage.includes('kidney') || lowerMessage.includes('urinate') || lowerMessage.includes('urination') || lowerMessage.includes('urine')) {
    return "For Kidney/Urinary: Tab. Folzicon 100mg - as prescribed, Tab. Pyridium - for pain, Tab. Nitrofurantoin 100mg - for UTI (as prescribed). Prevention: Drink water, Don't hold urine. Consult nephrologist!";
  }
  
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('depression') || lowerMessage.includes('mental') || lowerMessage.includes('sad')) {
    return "For Mental Health: Tab. Alprazolam 0.25mg - as prescribed (short-term), Tab. Escitalopram 10mg - daily (long-term). Natural: Deep breathing, Exercise, Talk to someone, Sleep well, Meditation. Please consult a mental health professional!";
  }
  
  if (lowerMessage.includes('pregnant') || lowerMessage.includes('pregnancy') || lowerMessage.includes('baby')) {
    return "For Pregnancy: Folic Acid 5mg - daily, Iron tablets - as prescribed, Calcium + Vitamin D - daily. Care: Regular check-ups, Balanced nutrition, Avoid raw fish/unpasteurized foods, No alcohol/smoking. Always consult your obstetrician!";
  }
  
  if (lowerMessage.includes('period') || lowerMessage.includes('menstrual') || lowerMessage.includes('pcod') || lowerMessage.includes('pcos')) {
    return "For Menstrual Health: Tab. Meftal Spas - when needed for pain, Tab. Tranexamic Acid - for heavy bleeding. Tips: Heating pad, Exercise, Iron-rich foods, Hydration. Consult gynecologist for persistent issues!";
  }
  
  if (lowerMessage.includes('thyroid') || lowerMessage.includes('thyroxine')) {
    return "For Thyroid: Tab. Thyroxine 50-100mcg - daily (morning, empty stomach). Important: Take on empty stomach, Don't take with calcium/iron within 4 hours, Regular blood tests. Follow endocrinologist's prescription!";
  }
  
  if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('cant sleep')) {
    return "For Sleep: Tab. Melatonin 5mg - before bed, Tab. Zolpidem - as prescribed (short-term). Tips: Sleep schedule, No screens before bed, Limit caffeine, Exercise, Cool dark room. Consult doctor if persists!";
  }
  
  if (lowerMessage.includes('weight') || lowerMessage.includes('lose weight') || lowerMessage.includes('obesity') || lowerMessage.includes('slim')) {
    return "For Weight: Tips - Eat vegetables and protein, Limit sugar/processed foods, Exercise 30 mins daily, Drink water, Sleep well. Consult nutritionist for personalized plans!";
  }
  
  if (lowerMessage.includes('bone') || lowerMessage.includes('fracture') || lowerMessage.includes('calcium') || lowerMessage.includes('osteoporosis')) {
    return "For Bone Health: Tab. Calcium Carbonate 500mg - twice daily, Tab. Vitamin D3 60000IU - weekly, Omega-3 - daily. Tips: Calcium foods, Sunlight 15 mins, Exercise, Don't smoke. Consult orthopedic!";
  }
  
  if (lowerMessage.includes('tooth') || lowerMessage.includes('dental') || lowerMessage.includes('teeth') || lowerMessage.includes('toothache')) {
    return "For Dental: Tab. Ibuprofen 400mg - when needed, Gel. Orajel - apply on area. Care: Rinse with salt water, Avoid hot/cold foods, Don't put aspirin on tooth. See dentist ASAP for persistent pain!";
  }
  
  if (lowerMessage.includes('vitamin') || lowerMessage.includes('supplement') || lowerMessage.includes('deficiency') || lowerMessage.includes('anemia')) {
    return "Common Vitamins: D3 - bones/immunity, B12 - energy/nerves, C - immunity, Iron - blood, Calcium - bones, Omega-3 - heart/brain, Zinc - immunity. Important: Get blood tests first, consult doctor for dosage!";
  }
  
  if (lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('tablet') || lowerMessage.includes('capsule')) {
    return "I can help with medicine info! Tell me: What medicine do you want to know about? What's your condition? Any allergies? Categories: Pain relief (Paracetamol, Ibuprofen), Antibiotics, Vitamins, Chronic disease medicines. Always consult doctor for serious conditions!";
  }
  
  if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist') || lowerMessage.includes('which doctor')) {
    return "Specialists: Heart/BP - Cardiologist, Breathing - Pulmonologist, Head/Nerves - Neurologist, Bones - Orthopedic, Children - Pediatrician, Eyes - Ophthalmologist, Kidney - Nephrologist, Diabetes - Endocrinologist, Skin - Dermatologist, Pregnancy - Gynecologist, Mental - Psychiatrist, Teeth - Dentist. Start with General Physician!";
  }
  
  if (lowerMessage.includes('test') || lowerMessage.includes('checkup') || lowerMessage.includes('blood test') || lowerMessage.includes('diagnosis')) {
    return "Common Tests: CBC - blood count, Blood Sugar - diabetes, Lipid Profile - cholesterol, Thyroid Panel, Vitamin D/B12, X-ray, ECG - heart, Ultrasound. Always consult doctor to know which tests you need based on symptoms!";
  }
  
  return `I understand: "${message}"\n\nI'm your AI health assistant at Unity Health Hub. I can help with:\n\n- Symptoms and illnesses (fever, cold, headache, etc.)\n- Medication information\n- Health advice and treatment\n- When to see a doctor\n\nPlease tell me: What specific symptoms are you experiencing? How long have you had them?\n\nOr ask me: "What for fever?", "Medicine for headache", "When to see a doctor"`;
};

export default getAIResponse;
