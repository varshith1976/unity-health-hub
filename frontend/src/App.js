import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import SpecializationSearch from './components/SpecializationSearch';
import DoctorList from './components/DoctorList';
import AppointmentBooking from './components/AppointmentBooking';
import PaymentGateway from './components/PaymentGateway';
import AppointmentConfirmation from './components/AppointmentConfirmation';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import VideoConsultation from './components/VideoConsultation';
import AIDoctor from './components/AIDoctor';
import MedicationReminder from './components/MedicationReminder';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import './styles/App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [, setCurrentStep] = useState('search');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMedicationReminder, setShowMedicationReminder] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleOpenLogin = (action = null) => {
    setPendingAction(action);
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
    setPendingAction(null);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setIsLoggedIn(true);
    setUser(loggedInUser);
    toast.success(`Welcome ${loggedInUser.name}! Logged in as ${loggedInUser.role}`);
    
    if (pendingAction) {
      pendingAction();
    } else {
      setCurrentView('home');
    }
  };

  const handleHomeClick = () => {
    setCurrentView('home');
    setCurrentStep('search');
    setShowDoctorList(false);
  };

  const handleFindDoctors = () => {
    if (!isLoggedIn) {
      handleOpenLogin(() => {
        setCurrentView('search');
        setCurrentStep('search');
        setShowDoctorList(false);
      });
      return;
    }
    setCurrentView('search');
    setCurrentStep('search');
    setShowDoctorList(false);
  };

  const handleAboutUs = () => {
    setCurrentView('about');
  };

  const handleContact = () => {
    setCurrentView('contact');
  };

  const handleLoginClick = () => {
    handleOpenLogin();
  };

  const handleSignupClick = () => {
    handleOpenLogin();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('home');
    toast.success('Logged out successfully!');
  };

  const handleViewDashboard = () => {
    if (!isLoggedIn) {
      handleOpenLogin(() => {
        if (user?.role === 'doctor') {
          setCurrentView('doctorDashboard');
        } else {
          setCurrentView('patientDashboard');
        }
      });
      return;
    }
    if (user?.role === 'doctor') {
      setCurrentView('doctorDashboard');
    } else {
      setCurrentView('patientDashboard');
    }
  };

  const handleStartConsultation = () => {
    if (!isLoggedIn) {
      handleOpenLogin(() => {
        setCurrentView('telemedicine');
      });
      return;
    }
    setCurrentView('telemedicine');
  };

  const handleStartAIDoctor = () => {
    if (!isLoggedIn) {
      handleOpenLogin(() => {
        setCurrentView('aiDoctor');
      });
      return;
    }
    setCurrentView('aiDoctor');
  };

  const handleMedicineReminder = () => {
    if (!isLoggedIn) {
      handleOpenLogin(() => {
        setShowMedicationReminder(true);
      });
      return;
    }
    setShowMedicationReminder(true);
  };

  const handleCloseMedicationReminder = () => {
    setShowMedicationReminder(false);
  };

  const handleDoctorsFound = (foundDoctors) => {
    setDoctors(foundDoctors);
    setCurrentView('doctorList');
    setShowDoctorList(true); // Important: Show the doctor list!
    if (foundDoctors.length === 0) {
      toast.info('No doctors found. Try different filters.');
    } else {
      toast.success(`Found ${foundDoctors.length} doctors`);
    }
  };

  const handleSelectDoctor = (doctor) => {
    if (!isLoggedIn) {
      handleOpenLogin(() => {
        setSelectedDoctor(doctor);
        setCurrentStep('booking');
        setCurrentView('booking');
        setShowDoctorList(false);
      });
      return;
    }
    setSelectedDoctor(doctor);
    setCurrentStep('booking');
    setCurrentView('booking');
    setShowDoctorList(false);
  };

  const handleBackToDoctorList = () => {
    setCurrentStep('search');
    setCurrentView('doctorList');
    setSelectedDoctor(null);
  };

  const handleAppointmentCreated = (newAppointment) => {
    setAppointment(newAppointment);
    setCurrentStep('payment');
    setCurrentView('payment');
    toast.success('Appointment created! Please complete payment.');
  };

  const handlePaymentSuccess = (paidAppointment) => {
    setConfirmedAppointment(paidAppointment);
    setAppointment(paidAppointment);
    setCurrentView('telemedicine');
    toast.success('Payment successful! Starting video consultation...');
  };

  const handlePaymentCancel = () => {
    setCurrentStep('search');
    setCurrentView('search');
    setShowDoctorList(true);
    setDoctors([]);
    setSelectedDoctor(null);
    setAppointment(null);
  };

  const handleNewAppointment = () => {
    setCurrentStep('search');
    setCurrentView('search');
    setShowDoctorList(false);
    setDoctors([]);
    setSelectedDoctor(null);
    setAppointment(null);
    setConfirmedAppointment(null);
  };

  const handleSearchClick = () => {
    if (!isLoggedIn) {
      handleOpenLogin(() => {
        setCurrentView('search');
        setCurrentStep('search');
        setShowDoctorList(false);
      });
      return;
    }
    setCurrentView('search');
    setCurrentStep('search');
    setShowDoctorList(false);
  };

  const handleEndConsultation = (consultationData) => {
    setCurrentView('patientDashboard');
    toast.success('Consultation ended successfully!');
  };

  const renderContent = () => {
    if (isLoggedIn && user?.role === 'doctor' && currentView === 'doctorDashboard') {
      return <DoctorDashboard user={user} onLogout={handleLogout} />;
    }

    if (isLoggedIn && user?.role === 'patient' && currentView === 'patientDashboard') {
      return <PatientDashboard user={user} onLogout={handleLogout} onNavigateToMedicines={handleMedicineReminder} />;
    }

    if (currentView === 'aiDoctor') {
      return <AIDoctor onEndConsultation={handleEndConsultation} />;
    }

    if (currentView === 'telemedicine') {
      return <VideoConsultation appointment={appointment} onEndConsultation={handleEndConsultation} />;
    }

    switch (currentView) {
      case 'doctorList':
        return (
          <div className="doctor-list-view">
            {showDoctorList && doctors.length > 0 ? (
              <DoctorList doctors={doctors} onSelectDoctor={handleSelectDoctor} />
            ) : (
              <SpecializationSearch onDoctorsFound={handleDoctorsFound} />
            )}
          </div>
        );

      case 'booking':
        return selectedDoctor ? (
          <AppointmentBooking
            doctor={selectedDoctor}
            onBack={handleBackToDoctorList}
            onAppointmentCreated={handleAppointmentCreated}
          />
        ) : (
          <>
            <SpecializationSearch onDoctorsFound={handleDoctorsFound} />
            {showDoctorList && doctors.length > 0 && (
              <DoctorList doctors={doctors} onSelectDoctor={handleSelectDoctor} />
            )}
          </>
        );

      case 'payment':
        return appointment ? (
          <PaymentGateway
            appointment={appointment}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        ) : (
          <>
            <SpecializationSearch onDoctorsFound={handleDoctorsFound} />
            {showDoctorList && doctors.length > 0 && (
              <DoctorList doctors={doctors} onSelectDoctor={handleSelectDoctor} />
            )}
          </>
        );

      case 'confirmation':
        return (
          <>
            {confirmedAppointment && <AppointmentConfirmation appointment={confirmedAppointment} />}
            <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px' }}>
              <button className="btn btn-primary" onClick={handleNewAppointment}>
                Book Another Appointment
              </button>
            </div>
          </>
        );

      case 'search':
        return (
          <div className="search-view">
            <SpecializationSearch onDoctorsFound={handleDoctorsFound} />
            {showDoctorList && doctors.length > 0 && (
              <DoctorList doctors={doctors} onSelectDoctor={handleSelectDoctor} />
            )}
          </div>
        );

      case 'about':
        return <AboutUs />;

      case 'contact':
        return <ContactUs />;

      default:
        return <Home onSearchClick={handleSearchClick} onStartAIDoctor={handleStartAIDoctor} isLoggedIn={isLoggedIn} onLoginClick={handleLoginClick} />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Header
          currentView={currentView}
          onHomeClick={handleHomeClick}
          onFindDoctors={handleFindDoctors}
          onAboutUs={handleAboutUs}
          onContact={handleContact}
          onLogin={handleLoginClick}
          onSignup={handleSignupClick}
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
          onViewDashboard={handleViewDashboard}
          onStartConsultation={handleStartConsultation}
          onStartAIDoctor={handleStartAIDoctor}
          onMedicineReminder={handleMedicineReminder}
        />

        <main className="main-content">
          {currentView === 'home' ? (
            <Home onSearchClick={handleSearchClick} onStartAIDoctor={handleStartAIDoctor} isLoggedIn={isLoggedIn} onLoginClick={handleLoginClick} />
          ) : (
            renderContent()
          )}
        </main>

        {(currentView !== 'aiDoctor' && currentView !== 'telemedicine') && <Footer />}

        <MedicationReminder 
          isOpen={showMedicationReminder} 
          onClose={handleCloseMedicationReminder} 
        />

        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseLogin}
          onLogin={handleLoginSuccess}
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
