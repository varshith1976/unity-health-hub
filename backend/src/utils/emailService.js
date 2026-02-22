const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send appointment confirmation email
exports.sendAppointmentConfirmation = async (appointment, doctor, patient) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@healthcare.com',
      to: patient.patient_email,
      subject: 'Appointment Confirmation - Unity Health Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #10b981); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Appointment Confirmed!</h1>
          </div>
          <div style="padding: 20px; background: #f8fafc;">
            <p>Dear <strong>${patient.patient_name}</strong>,</p>
            <p>Your appointment has been confirmed. Here are the details:</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Booking ID:</strong> ${appointment.booking_id}</p>
              <p><strong>Doctor:</strong> Dr. ${doctor.full_name}</p>
              <p><strong>Specialization:</strong> ${doctor.specialization}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${appointment.appointment_time}</p>
              <p><strong>Hospital:</strong> ${doctor.hospital_name}</p>
              <p><strong>Address:</strong> ${doctor.hospital_address}</p>
              <p><strong>Consultation Fee:</strong> ₹${appointment.consultation_fee}</p>
            </div>
            
            <p><strong>Please arrive 15 minutes before your scheduled time.</strong></p>
            <p>携带您的身份证件和任何相关的医疗记录。</p>
            
            <p>If you need to cancel or reschedule, please do so at least 2 hours before your appointment.</p>
            
            <p>Thank you for choosing Unity Health Hub!</p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b;">
              <p>Unity Health Hub</p>
              <p>Your Health, Our Priority</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send payment confirmation email
exports.sendPaymentConfirmation = async (appointment, paymentDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@healthcare.com',
      to: appointment.patient_email,
      subject: 'Payment Received - Unity Health Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Payment Successful!</h1>
          </div>
          <div style="padding: 20px; background: #f8fafc;">
            <p>Dear <strong>${appointment.patient_name}</strong>,</p>
            <p>We have received your payment. Here are the details:</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Booking ID:</strong> ${appointment.booking_id}</p>
              <p><strong>Amount Paid:</strong> ₹${paymentDetails.amount}</p>
              <p><strong>Payment ID:</strong> ${paymentDetails.payment_id}</p>
              <p><strong>Transaction ID:</strong> ${paymentDetails.transaction_id}</p>
            </div>
            
            <p>Your appointment is confirmed. Please arrive 15 minutes before your scheduled time.</p>
            
            <p>Thank you for choosing Unity Health Hub!</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending payment email:', error);
    return { success: false, error: error.message };
  }
};

// Send appointment reminder email
exports.sendAppointmentReminder = async (appointment, doctor, patient) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@healthcare.com',
      to: patient.patient_email,
      subject: 'Appointment Reminder - Unity Health Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Appointment Reminder</h1>
          </div>
          <div style="padding: 20px; background: #f8fafc;">
            <p>Dear <strong>${patient.patient_name}</strong>,</p>
            <p>This is a reminder for your upcoming appointment:</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Doctor:</strong> Dr. ${doctor.full_name}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${appointment.appointment_time}</p>
              <p><strong>Hospital:</strong> ${doctor.hospital_name}</p>
            </div>
            
            <p><strong>Please arrive 15 minutes before your scheduled time.</strong></p>
            
            <p>Thank you!</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return { success: false, error: error.message };
  }
};

// Send cancellation email
exports.sendCancellationEmail = async (appointment, doctor, patient) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@healthcare.com',
      to: patient.patient_email,
      subject: 'Appointment Cancelled - Unity Health Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Appointment Cancelled</h1>
          </div>
          <div style="padding: 20px; background: #f8fafc;">
            <p>Dear <strong>${patient.patient_name}</strong>,</p>
            <p>Your appointment has been cancelled as requested.</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Booking ID:</strong> ${appointment.booking_id}</p>
              <p><strong>Doctor:</strong> Dr. ${doctor.full_name}</p>
              <p><strong>Original Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
            </div>
            
            <p>If you did not request this cancellation, please contact us immediately.</p>
            <p>To book a new appointment, please visit our website.</p>
            
            <p>Thank you!</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return { success: false, error: error.message };
  }
};
