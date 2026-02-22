import React, { useState } from 'react';
import { FaLock, FaCheckCircle, FaQrcode, FaVideo } from 'react-icons/fa';
import './PaymentGateway.css';

const PaymentGateway = ({ appointment, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('scan'); // 'scan' | 'processing' | 'success'

  const handleScanPayment = async () => {
    setProcessing(true);
    setPaymentStep('processing');
    
    // Simulate payment processing (in real app, this would verify the QR payment)
    setTimeout(() => {
      setPaymentStep('success');
      setProcessing(false);
      
      // Save appointment to localStorage for telemedicine access
      const appointmentData = {
        ...appointment,
        paymentStatus: 'completed',
        paymentTime: new Date().toISOString()
      };
      localStorage.setItem('currentAppointment', JSON.stringify(appointmentData));
    }, 2500);
  };

  const handleStartVideoCall = () => {
    if (onPaymentSuccess) {
      onPaymentSuccess({
        ...appointment,
        paymentStatus: 'completed'
      });
    }
  };

  // Calculate expiry time (15 minutes from now for demo)
  const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

  return (
    <div className="payment-container">
      <div className="payment-header">
        <FaLock className="lock-icon" />
        <h3>Secure Payment</h3>
        <p>Scan the QR code to pay ₹{appointment.consultationFee}</p>
      </div>

      {paymentStep === 'scan' && (
        <>
          <div className="qr-scanner-container">
            <div className="qr-scanner">
              <div className="scanner-frame">
                <FaQrcode className="qr-icon" />
                <img 
                  src="/payment.jpeg" 
                  alt="Payment QR Code" 
                  className="payment-qr"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="qr-placeholder" style={{ display: 'none' }}>
                  <FaQrcode style={{ fontSize: '4rem', color: '#2563eb' }} />
                  <p>QR Code Scanner</p>
                </div>
              </div>
              <div className="scanner-line"></div>
            </div>
            
            <div className="payment-instructions">
              <h4>How to Pay:</h4>
              <ol>
                <li>Open any UPI app (Google Pay, PhonePe, Paytm)</li>
                <li>Scan the QR code above</li>
                <li>Enter the amount: <strong>₹{appointment.consultationFee}</strong></li>
                <li>Complete the payment</li>
              </ol>
            </div>
          </div>

          <div className="appointment-summary">
            <h4>Appointment Summary</h4>
            <div className="summary-row">
              <span>Doctor:</span>
              <strong>{appointment.doctorName}</strong>
            </div>
            <div className="summary-row">
              <span>Specialization:</span>
              <strong>{appointment.specialization}</strong>
            </div>
            <div className="summary-row">
              <span>Date:</span>
              <strong>{new Date(appointment.appointmentDate).toLocaleDateString()}</strong>
            </div>
            <div className="summary-row">
              <span>Time:</span>
              <strong>{appointment.appointmentTime}</strong>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <strong>₹{appointment.consultationFee}</strong>
            </div>
          </div>

          <div className="payment-timer">
            <p>Payment expires in: <strong>{expiryTime.toLocaleTimeString()}</strong></p>
            <span className="timer-note">Please complete payment within 15 minutes</span>
          </div>

          <button
            className="btn btn-primary pay-btn"
            onClick={handleScanPayment}
            disabled={processing}
          >
            <FaCheckCircle />
            {processing ? 'Verifying Payment...' : 'I Have Paid'}
          </button>
        </>
      )}

      {paymentStep === 'processing' && (
        <div className="payment-processing">
          <div className="processing-animation">
            <div className="spinner"></div>
            <h3>Processing Payment...</h3>
            <p>Please wait while we verify your payment</p>
          </div>
        </div>
      )}

      {paymentStep === 'success' && (
        <div className="payment-success">
          <div className="success-content">
            <div className="success-icon-wrapper">
              <FaCheckCircle className="success-check" />
            </div>
            <h3>Payment Successful!</h3>
            <p>Your appointment has been confirmed</p>
            
            <div className="success-details">
              <div className="detail-item">
                <span className="label">Amount Paid:</span>
                <span className="value">₹{appointment.consultationFee}</span>
              </div>
              <div className="detail-item">
                <span className="label">Transaction ID:</span>
                <span className="value">TXN-{Date.now()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="value success">Completed</span>
              </div>
            </div>

            <div className="telemedicine-section">
              <h4>Start Your Video Consultation</h4>
              <p>Connect with {appointment.doctorName} via video call</p>
              
              <button 
                className="btn btn-primary video-btn"
                onClick={handleStartVideoCall}
              >
                <FaVideo />
                Start Video Call Now
              </button>
            </div>

            <div className="booking-info">
              <p>Booking ID: <strong>{appointment.bookingId || 'Generating...'}</strong></p>
              <span className="note">You can also start the video call later from your dashboard</span>
            </div>
          </div>
        </div>
      )}

      <div className="payment-methods">
        <p>Accepted payment methods:</p>
        <div className="methods">
          <span>📱 GPay</span>
          <span>📱 PhonePe</span>
          <span>📱 Paytm</span>
          <span>📱 BHIM</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
