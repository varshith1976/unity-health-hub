const pool = require('../config/database');

class ClinicalAnalysis {
  static async create(analysisData) {
    const {
      consultationId,
      symptoms,
      severityLevel,
      riskFactors,
      suggestedDiagnosis,
      diagnosisConfidence,
      medications,
      requiresPhysicalExam,
      requiresEmergencyCare,
      redFlags,
      clinicalKeywords
    } = analysisData;

    const query = `
      INSERT INTO clinical_analysis (
        consultation_id, symptoms_identified, severity_level, risk_factors,
        suggested_diagnosis, diagnosis_confidence, medication_recommendations,
        requires_physical_exam, requires_emergency_care, red_flags, clinical_keywords
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(query, [
      consultationId,
      symptoms,
      severityLevel,
      riskFactors,
      suggestedDiagnosis,
      diagnosisConfidence,
      medications,
      requiresPhysicalExam,
      requiresEmergencyCare,
      redFlags,
      clinicalKeywords
    ]);

    return result.rows[0];
  }

  static async findByConsultationId(consultationId) {
    const query = 'SELECT * FROM clinical_analysis WHERE consultation_id = $1';
    const result = await pool.query(query, [consultationId]);
    return result.rows[0];
  }

  static async analyzeTranscript(transcript) {
    // AI/NLP Analysis Logic (Mock implementation - integrate with actual AI service)
    const keywords = this.extractKeywords(transcript);
    const symptoms = this.identifySymptoms(transcript);
    const severity = this.assessSeverity(transcript, symptoms);
    const redFlags = this.detectRedFlags(transcript);
    
    return {
      symptoms,
      severityLevel: severity,
      riskFactors: this.identifyRiskFactors(transcript),
      suggestedDiagnosis: this.suggestDiagnosis(symptoms),
      diagnosisConfidence: 0.75,
      medications: this.recommendMedications(symptoms, severity),
      requiresPhysicalExam: redFlags.length > 0 || severity === 'high' || severity === 'critical',
      requiresEmergencyCare: severity === 'critical',
      redFlags,
      clinicalKeywords: keywords
    };
  }

  static extractKeywords(transcript) {
    const medicalKeywords = [
      'pain', 'fever', 'cough', 'headache', 'nausea', 'vomiting', 'dizziness',
      'chest pain', 'shortness of breath', 'fatigue', 'weakness', 'bleeding',
      'swelling', 'rash', 'infection', 'diabetes', 'hypertension', 'allergy'
    ];
    
    const found = [];
    const lowerTranscript = transcript.toLowerCase();
    
    medicalKeywords.forEach(keyword => {
      if (lowerTranscript.includes(keyword)) {
        found.push(keyword);
      }
    });
    
    return found;
  }

  static identifySymptoms(transcript) {
    const symptoms = [];
    const lowerTranscript = transcript.toLowerCase();
    
    const symptomPatterns = {
      'fever': /fever|temperature|hot/i,
      'cough': /cough|coughing/i,
      'chest pain': /chest pain|chest discomfort/i,
      'headache': /headache|head pain/i,
      'shortness of breath': /shortness of breath|breathing difficulty|breathless/i,
      'nausea': /nausea|nauseous|sick/i,
      'fatigue': /tired|fatigue|exhausted|weakness/i,
      'dizziness': /dizzy|dizziness|lightheaded/i
    };

    Object.entries(symptomPatterns).forEach(([symptom, pattern]) => {
      if (pattern.test(lowerTranscript)) {
        symptoms.push(symptom);
      }
    });

    return symptoms;
  }

  static assessSeverity(transcript, symptoms) {
    const criticalKeywords = ['severe', 'unbearable', 'emergency', 'critical', 'chest pain', 'shortness of breath', 'unconscious'];
    const highKeywords = ['intense', 'sharp', 'persistent', 'worsening'];
    const moderateKeywords = ['moderate', 'uncomfortable', 'bothering'];
    
    const lowerTranscript = transcript.toLowerCase();
    
    if (criticalKeywords.some(kw => lowerTranscript.includes(kw))) return 'critical';
    if (highKeywords.some(kw => lowerTranscript.includes(kw)) || symptoms.length > 4) return 'high';
    if (moderateKeywords.some(kw => lowerTranscript.includes(kw)) || symptoms.length > 2) return 'moderate';
    return 'low';
  }

  static detectRedFlags(transcript) {
    const redFlags = [];
    const lowerTranscript = transcript.toLowerCase();
    
    const redFlagPatterns = [
      { flag: 'Chest pain with radiation', pattern: /chest pain.*(arm|jaw|shoulder)/i },
      { flag: 'Severe shortness of breath', pattern: /severe.*(breath|breathing)/i },
      { flag: 'Loss of consciousness', pattern: /unconscious|fainted|passed out/i },
      { flag: 'Severe bleeding', pattern: /severe.*bleed|heavy.*bleed/i },
      { flag: 'Sudden severe headache', pattern: /sudden.*severe.*headache/i },
      { flag: 'Stroke symptoms', pattern: /slurred speech|facial droop|arm weakness/i }
    ];

    redFlagPatterns.forEach(({ flag, pattern }) => {
      if (pattern.test(lowerTranscript)) {
        redFlags.push(flag);
      }
    });

    return redFlags;
  }

  static identifyRiskFactors(transcript) {
    const riskFactors = [];
    const lowerTranscript = transcript.toLowerCase();
    
    const riskPatterns = {
      'Diabetes': /diabetes|diabetic/i,
      'Hypertension': /hypertension|high blood pressure/i,
      'Heart disease': /heart disease|cardiac/i,
      'Smoking': /smok(e|ing)|cigarette/i,
      'Obesity': /obese|obesity|overweight/i,
      'Family history': /family history/i
    };

    Object.entries(riskPatterns).forEach(([risk, pattern]) => {
      if (pattern.test(lowerTranscript)) {
        riskFactors.push(risk);
      }
    });

    return riskFactors;
  }

  static suggestDiagnosis(symptoms) {
    const diagnoses = [];
    
    if (symptoms.includes('fever') && symptoms.includes('cough')) {
      diagnoses.push('Upper Respiratory Tract Infection');
      diagnoses.push('Viral Fever');
    }
    if (symptoms.includes('chest pain') && symptoms.includes('shortness of breath')) {
      diagnoses.push('Possible Cardiac Event (Requires Immediate Evaluation)');
      diagnoses.push('Pulmonary Condition');
    }
    if (symptoms.includes('headache') && symptoms.includes('fever')) {
      diagnoses.push('Viral Infection');
      diagnoses.push('Sinusitis');
    }
    if (symptoms.includes('nausea') && symptoms.includes('fatigue')) {
      diagnoses.push('Gastroenteritis');
      diagnoses.push('Dehydration');
    }

    return diagnoses.length > 0 ? diagnoses : ['General Consultation Required'];
  }

  static recommendMedications(symptoms, severity) {
    if (severity === 'critical' || severity === 'high') {
      return ['Immediate medical evaluation required - No remote prescription'];
    }

    const medications = [];
    
    if (symptoms.includes('fever')) {
      medications.push('Paracetamol 500mg (as needed for fever)');
    }
    if (symptoms.includes('cough')) {
      medications.push('Cough syrup (as directed)');
    }
    if (symptoms.includes('headache')) {
      medications.push('Ibuprofen 400mg (as needed)');
    }
    if (symptoms.includes('nausea')) {
      medications.push('Antiemetic (consult doctor for dosage)');
    }

    return medications.length > 0 ? medications : ['Symptomatic treatment as advised by doctor'];
  }
}

module.exports = ClinicalAnalysis;
