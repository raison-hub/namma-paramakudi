import React, { useState } from 'react';
import axios from 'axios';
import { Star, X, User, MessageSquare } from 'lucide-react';
import { translations } from '../translations';

export default function ReviewModal({ isOpen, onClose, listing, lang = 'en', onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !listing) return null;

  const t = translations[lang] || translations.en;
  const reviews = listing.reviews || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg(lang === 'ta' ? 'கருத்தை உள்ளிடவும்' : 'Please provide feedback comment');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await axios.post(`https://namma-paramakudi-api.vercel.app/api/listings/${listing._id}/reviews`, {
        reviewerName: reviewerName.trim() || undefined,
        rating,
        comment: comment.trim(),
      });

      if (onReviewAdded) {
        onReviewAdded(res.data);
      }
      setComment('');
      setReviewerName('');
      setRating(5);
    } catch (err) {
      console.error(err);
      setErrorMsg(lang === 'ta' ? 'கருத்தை பதிவிட முடியவில்லை' : 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{listing.title}</h3>
            <p className="text-xs text-slate-500">{listing.subArea} • {t.reviewsHeading || 'Reviews & Ratings'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Reviews List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {reviews.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{t.noReviewsYet || 'No reviews yet. Be the first to share your experience!'}</p>
            </div>
          ) : (
            reviews.map((rev, index) => (
              <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {rev.reviewerName}
                  </span>
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 text-xs mt-1">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.rateThisService || 'Rate this Service'}:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-0.5 focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder={t.yourName || 'Your Name (Optional)'}
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />

          <textarea
            rows="2"
            placeholder={t.yourFeedback || 'Share your experience...'}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none"
          />

          {errorMsg && <p className="text-red-500 text-[11px]">{errorMsg}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-2 rounded-xl text-xs transition disabled:opacity-50"
          >
            {submitting ? (t.submitting || 'Submitting...') : (t.submitReview || 'Submit Feedback')}
          </button>
        </form>
      </div>
    </div>
  );
}