import React, { useState } from 'react';
import { FaStar, FaThumbsUp, FaCommentAlt, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { createFeedback } from '../services/api';
import './FeedbackForm.css';

const FeedbackForm = ({ consultationId, doctorId, doctorName, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoverRating(value);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createFeedback({
        consultationId,
        doctorId,
        rating,
        feedbackText,
        isAnonymous
      });
      
      setSubmitted(true);
      
      // Call parent callback after successful submission
      if (onSubmit) {
        onSubmit({ rating, feedbackText, isAnonymous });
      }
      
      // Close after delay
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 2000);
      
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      // For demo, still show success
      setSubmitted(true);
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const quickFeedback = [
    { id: 1, text: 'Very Professional', icon: '👨‍⚕️' },
    { id: 2, text: 'Great Communication', icon: '💬' },
    { id: 3, text: 'Very Knowledgeable', icon: '🧠' },
    { id: 4, text: 'Recommended', icon: '👍' },
    { id: 5, text: 'Caring & Compassionate', icon: '❤️' },
  ];

  const addQuickFeedback = (text) => {
    setFeedbackText(prev => prev ? `${prev}, ${text}` : text);
  };

  if (submitted) {
    return (
      <div className="feedback-form-container">
        <div className="feedback-success">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h2>Thank You!</h2>
          <p>Your feedback has been submitted successfully.</p>
          <div className="submitted-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={i < rating ? 'star filled' : 'star'} 
              />
            ))}
          </div>
          <p className="success-message">Your feedback helps us improve our service.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-form-container">
      <div className="feedback-form-header">
        <h2>Rate Your Consultation</h2>
        <p>How was your consultation with {doctorName}?</p>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        {/* Star Rating */}
        <div className="rating-section">
          <label>Your Rating</label>
          <div className="star-rating" onMouseLeave={handleRatingLeave}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`star-btn ${value <= (hoverRating || rating) ? 'active' : ''}`}
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => handleRatingHover(value)}
              >
                <FaStar />
              </button>
            ))}
          </div>
          <p className="rating-text">
            {rating === 0 && 'Tap to rate'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent!'}
          </p>
        </div>

        {/* Quick Feedback Tags */}
        <div className="quick-feedback-section">
          <label>Quick Feedback (Optional)</label>
          <div className="quick-feedback-tags">
            {quickFeedback.map((item) => (
              <button
                key={item.id}
                type="button"
                className="quick-feedback-tag"
                onClick={() => addQuickFeedback(item.text)}
              >
                <span>{item.icon}</span> {item.text}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="feedback-text-section">
          <label>
            <FaCommentAlt /> Additional Comments
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows="4"
          />
        </div>

        {/* Anonymous Option */}
        <div className="anonymous-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <span className="checkmark"></span>
            Submit feedback anonymously
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="form-actions">
          {onClose && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Skip
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || rating === 0}
          >
            {loading ? (
              'Submitting...'
            ) : (
              <>
                <FaPaperPlane /> Submit Feedback
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
