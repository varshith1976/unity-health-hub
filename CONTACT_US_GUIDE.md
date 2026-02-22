# 📧 Contact Us Page - Implementation Guide

## ✅ Files Created:

1. `frontend/src/pages/ContactUs.js` - Contact page component
2. `frontend/src/pages/ContactUs.css` - Styling

---

## 🚀 How to Add to Your App:

### Step 1: Add Route in App.js

Open `frontend/src/App.js` and add:

```javascript
import ContactUs from './pages/ContactUs';

// Inside your routes:
<Route path="/contact" element={<ContactUs />} />
```

### Step 2: Add Navigation Link

In your navigation/header component, add:

```javascript
<Link to="/contact">Contact Us</Link>
```

Or in your footer:

```javascript
<Link to="/contact">Contact</Link>
```

---

## 📋 Features Included:

✅ **Contact Information Cards**
   - Email: support@unityhealthhub.com
   - Phone: +91 XXXXXXXXXX
   - Location: India

✅ **Support Hours Display**
   - Monday-Saturday: 9 AM - 6 PM
   - Emergency: 24/7

✅ **Contact Form**
   - Full Name field
   - Email field
   - Phone Number field
   - Message textarea
   - Submit button

✅ **Success Message**
   - Shows after form submission
   - Auto-hides after 5 seconds

✅ **Care Message**
   - Heartbeat animation
   - Motivational text

✅ **Responsive Design**
   - Mobile-friendly
   - Tablet-optimized
   - Desktop layout

---

## 🎨 Design Features:

- **Modern UI** with gradient backgrounds
- **Card-based layout** for information
- **Hover effects** on cards
- **Smooth animations** (heartbeat, slide-down)
- **Professional color scheme** (Blue primary)
- **Icons** from react-icons
- **Form validation** (required fields)

---

## 📝 Customization:

### Change Contact Details:

Edit in `ContactUs.js`:

```javascript
// Email
<p>support@unityhealthhub.com</p>
// Change to your email

// Phone
<p>+91 XXXXXXXXXX</p>
// Change to your phone

// Location
<p>India</p>
// Change to your location
```

### Change Support Hours:

```javascript
<strong>Monday – Saturday</strong>
<span>9:00 AM – 6:00 PM</span>
// Change to your hours
```

### Add Form Submission API:

In `handleSubmit` function:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Add your API call here
    await api.post('/contact/submit', formData);
    
    setSubmitted(true);
    setFormData({ fullName: '', email: '', phone: '', message: '' });
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to send message. Please try again.');
  }
};
```

---

## 🔗 Example Routes Setup:

```javascript
// In App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 📱 Mobile View:

- Cards stack vertically
- Form takes full width
- Support hours stack
- Touch-friendly buttons

---

## 🎯 Usage:

1. User fills the form
2. Clicks "Submit Message"
3. Success message appears
4. Form resets automatically
5. Message saved (add API endpoint)

---

## 💡 Additional Features You Can Add:

1. **Email Integration**
   - Use Nodemailer to send emails
   - Send confirmation to user
   - Notify admin of new message

2. **Database Storage**
   - Save messages to database
   - Create admin panel to view messages

3. **Live Chat**
   - Add chat widget
   - Real-time support

4. **FAQ Section**
   - Add common questions
   - Reduce support requests

5. **Social Media Links**
   - Add Facebook, Twitter, Instagram
   - WhatsApp support button

---

## 🚀 Quick Test:

1. Start frontend: `cd frontend && npm start`
2. Go to: http://localhost:3000/contact
3. Fill the form
4. Click Submit
5. See success message!

---

## ✅ Complete!

Your professional Contact Us page is ready!

**Features:**
- ✅ Beautiful design
- ✅ Responsive layout
- ✅ Working form
- ✅ Success feedback
- ✅ Professional look
- ✅ Easy to customize

---

**Add it to your navigation and you're done!** 🎉
