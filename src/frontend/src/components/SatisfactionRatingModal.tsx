import { Star, X } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  enquiryId?: string;
}

export default function SatisfactionRatingModal({
  isOpen,
  onClose,
  enquiryId = "",
}: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Reset state when closed
  const handleClose = () => {
    setRating(0);
    setHover(0);
    setFeedback("");
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // In production this would call actor.submitRating(enquiryId, rating, feedback)
    void enquiryId;
    setSubmitted(true);
    setTimeout(handleClose, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      data-ocid="satisfaction_rating.dialog"
    >
      <div className="bg-[#06090f] border border-yellow-600/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-bold text-yellow-400">
            Rate Your Experience
          </h3>
          <button
            type="button"
            onClick={handleClose}
            data-ocid="satisfaction_rating.close_button"
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="Close rating modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {!submitted ? (
          <>
            <p className="text-gray-400 text-sm mb-4">
              How satisfied are you with our service?
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(s)}
                  data-ocid={`satisfaction_rating.star_${s}`}
                  aria-label={`Rate ${s} star${s !== 1 ? "s" : ""}`}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      s <= (hover || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more (optional)"
              rows={3}
              data-ocid="satisfaction_rating.feedback_textarea"
              className="w-full bg-black/60 border border-yellow-600/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none text-sm mb-4"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                data-ocid="satisfaction_rating.cancel_button"
                className="flex-1 py-2.5 border border-yellow-600/30 text-gray-400 rounded-xl hover:border-yellow-400 hover:text-white transition-all text-sm"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={rating === 0}
                data-ocid="satisfaction_rating.submit_button"
                className="flex-1 py-2.5 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 text-sm"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <div
            className="text-center py-4"
            data-ocid="satisfaction_rating.success_state"
          >
            <Star className="w-12 h-12 fill-yellow-400 text-yellow-400 mx-auto mb-2" />
            <p className="text-white font-semibold">
              Thank you for your feedback!
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Your rating helps us improve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
