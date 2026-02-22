import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (userData) => api.put('/auth/profile', userData);
export const changePassword = (passwords) => api.put('/auth/change-password', passwords);

// Doctor APIs
export const registerDoctor = (doctorData) => api.post('/doctors/register', doctorData);
export const getDoctorProfile = () => api.get('/doctors/profile/me');
export const updateDoctorProfile = (profileData) => api.put('/doctors/profile/me', profileData);
export const updateOnlineStatus = (isOnline) => api.put('/doctors/online-status', { isOnline });
export const getDoctorDashboardStats = () => api.get('/doctors/dashboard/stats');
export const getAllDoctors = (params) => api.get('/doctors', { params });
export const searchDoctors = (params) => api.get('/doctors/search', { params });
export const getDoctorById = (id) => api.get(`/doctors/${id}`);
export const getDoctorSlots = (id, params) => api.get(`/doctors/${id}/slots`, { params });
export const getSpecializations = () => api.get('/doctors/specializations');

// Appointment APIs
export const createAppointment = (data) => api.post('/appointments', data);
export const createPaymentOrder = (data) => api.post('/appointments/payment/create-order', data);
export const verifyPayment = (data) => api.post('/appointments/payment/verify', data);
export const getAppointments = () => api.get('/appointments');
export const getAppointmentById = (id) => api.get(`/appointments/${id}`);
export const cancelAppointment = (id) => api.put(`/appointments/${id}/cancel`);

// Consultation APIs
export const startConsultation = (data) => api.post('/consultations/start', data);
export const updateTranscript = (consultationId, transcript) => 
  api.post(`/consultations/${consultationId}/transcript`, { transcript });
export const updateAIAnalysis = (consultationId, aiAnalysis) => 
  api.post(`/consultations/${consultationId}/ai-analysis`, { aiAnalysis });
export const endConsultation = (consultationId) => 
  api.post(`/consultations/${consultationId}/end`);
export const getConsultation = (consultationId) => api.get(`/consultations/${consultationId}`);
export const getPatientConsultations = () => api.get('/consultations/patient/my-consultations');
export const getDoctorConsultations = () => api.get('/consultations/doctor/my-consultations');
export const getActiveConsultation = () => api.get('/consultations/doctor/active');

// AI Consultation Storage
export const saveConsultation = (data) => api.post('/consultations/save', data);
export const getConsultationHistory = () => api.get('/consultations/history');
export const submitFeedback = (data) => api.post('/consultations/feedback', data);

// Prescription APIs
export const createPrescription = (prescriptionData) => api.post('/prescriptions', prescriptionData);
export const updatePrescription = (prescriptionId, prescriptionData) => 
  api.put(`/prescriptions/${prescriptionId}`, prescriptionData);
export const getPrescription = (prescriptionId) => api.get(`/prescriptions/${prescriptionId}`);
export const getPatientPrescriptions = () => api.get('/prescriptions/patient/my-prescriptions');
export const getDoctorPrescriptions = () => api.get('/prescriptions/doctor/my-prescriptions');
export const getConsultationPrescription = (consultationId) => 
  api.get(`/prescriptions/consultation/${consultationId}`);
export const getLatestPrescriptions = (limit) => 
  api.get('/prescriptions/patient/latest', { params: { limit } });

// Feedback APIs
export const createFeedback = (feedbackData) => api.post('/feedback', feedbackData);
export const getPatientFeedback = () => api.get('/feedback/patient/my-feedback');
export const getDoctorFeedback = () => api.get('/feedback/doctor/my-feedback');
export const getDoctorFeedbackRecent = (limit) => 
  api.get('/feedback/doctor/recent', { params: { limit } });
export const getDoctorRatingSummary = () => api.get('/feedback/doctor/summary');

// AI Doctor APIs
export const getAIResponse = (message, symptoms, conversationHistory) => 
  api.post('/ai/chat', { message, symptoms, conversationHistory });

export const generatePrescription = (consultationData) => 
  api.post('/ai/generate-prescription', consultationData);

export const savePrescription = (prescriptionData) => 
  api.post('/prescriptions', prescriptionData);

export const addMedicationFromPrescription = (medicationData) => 
  api.post('/medications/from-prescription', medicationData);

export const getMedications = () => api.get('/medications');

export const getTodaySchedule = () => api.get('/medications/schedule/today');

export const recordDose = (doseData) => api.post('/medications/dose', doseData);

export default api;
