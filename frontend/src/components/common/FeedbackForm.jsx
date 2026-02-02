import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import StarRating from './StarRating';

const FeedbackForm = ({ onSubmit, allowAnonymousReviews = true }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    name: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const requireNameEmail = allowAnonymousReviews === false;

  const validateForm = () => {
    const newErrors = {};

    // Rating validation (required, 1-5)
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a rating between 1 and 5 stars';
    }

    // Comment validation (required, min 10 characters)
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please provide your feedback';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Feedback must be at least 10 characters';
    } else if (formData.comment.trim().length > 1000) {
      newErrors.comment = 'Feedback must be less than 1000 characters';
    }

    // Name validation (required when allowAnonymousReviews is false)
    if (requireNameEmail) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (formData.name.trim() && formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Reset submit status when form changes
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare data for API submission
      const submitData = {
        rating: formData.rating,
        comment: formData.comment.trim(),
        name: formData.name.trim() || null,
        email: formData.email.trim() || null,
      };

      // If onSubmit prop is provided, use it (for API integration)
      if (onSubmit) {
        await onSubmit(submitData);
      } else {
        // Mock API call - simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Feedback submitted:', submitData);
      }

      setSubmitStatus('success');
      // Reset form after successful submission
      setFormData({
        rating: 0,
        comment: '',
        name: '',
        email: '',
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      rating: 0,
      comment: '',
      name: '',
      email: '',
    });
    setErrors({});
    setSubmitStatus(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">Thank you for your feedback!</p>
              <p className="text-green-700 text-sm">Your review has been submitted and is pending approval.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Submission failed</p>
              <p className="text-red-700 text-sm">Please try again later or contact support.</p>
            </div>
          </div>
        )}

        {/* Star Rating Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary-dark">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <StarRating
            rating={formData.rating}
            setRating={(value) => handleChange('rating', value)}
            size="lg"
          />
          {errors.rating && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.rating}
            </p>
          )}
        </div>

        {/* Comment Text Area */}
        <div className="space-y-2">
          <label htmlFor="comment" className="block text-sm font-semibold text-primary-dark">
            Your Feedback <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            rows={5}
            placeholder="Share your experience with us..."
            value={formData.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
            className={`input-field resize-none ${
              errors.comment ? 'border-red-500 focus:ring-red-500' : ''
            }`}
          />
          <div className="flex justify-between items-center">
            {errors.comment ? (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.comment}
              </p>
            ) : (
              <span className="text-neutral-slate text-sm">Minimum 10 characters</span>
            )}
            <span className={`text-sm ${formData.comment.length > 1000 ? 'text-red-500' : 'text-neutral-slate'}`}>
              {formData.comment.length}/1000
            </span>
          </div>
        </div>

        {/* Name & Email Fields */}
        <div className="space-y-4">
          <p className="text-sm text-neutral-slate">
            {requireNameEmail ? 'Your name and email are required.' : 'Optional: Add your details to personalize your review'}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-primary-dark">
                Your Name {requireNameEmail && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-primary-dark">
                Your Email {requireNameEmail && <span className="text-red-500">*</span>}
              </label>
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-6 py-3 border-2 border-neutral-lightGray text-neutral-slate rounded-lg font-semibold hover:border-primary-dark hover:text-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
