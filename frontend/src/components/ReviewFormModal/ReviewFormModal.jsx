import { useState } from "react";
import { useDispatch } from "react-redux";
import { addReview } from "../../store/reviews";
import { useModal } from '../../context/Modal';
import { FaStar, FaRegStar } from "react-icons/fa";

function ReviewForm({ spotId, onAddReview }) {
  const [reviewText, setReviewText] = useState("");
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = { review: reviewText, stars };
    try {
      const newReview = await dispatch(addReview(spotId, reviewData));
      if (newReview) {
        onAddReview?.(newReview);
        setReviewText('');
        setStars(0);
        setTimeout(() => closeModal(), 0);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  const isSubmitDisabled = reviewText.trim().length < 10 || stars === 0;
  return (
    <div className="review-form-modal">
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Leave your review here..."
          required
        />
        <div className="star-rating">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              onMouseEnter={() => setHoverStars(index + 1)}
              onMouseLeave={() => setHoverStars(0)}
              onClick={() => setStars(index + 1)}
              style={{ cursor: 'pointer' }}
            >
              {hoverStars > index || stars > index ? (
                <FaStar color="#FFD700" size={30} />
              ) : (
                <FaRegStar color="#ddd" size={30} />
              )}
            </span>
          ))}
        </div>
        <button
          type="submit"
          className={`submit-review-button ${isSubmitDisabled ? "disabled" : ""}`}
          disabled={isSubmitDisabled}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;