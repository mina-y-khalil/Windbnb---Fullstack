import { useDispatch } from "react-redux";
import { deleteReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import "./DeleteReview.css";

const DeleteReview = ({ spotId, reviewId, onReviewDeleted }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteReview(spotId, reviewId));
      onReviewDeleted?.(reviewId);
      setTimeout(() => closeModal(), 0);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="delete-review-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <div className="delete-review-buttons">
        <button onClick={handleDelete} className="delete-button">
          Yes (Delete Review)
        </button>
        <button onClick={closeModal} className="cancel-button">
          No (Keep Review)
        </button>
      </div>
    </div>
  );
};

export default DeleteReview;