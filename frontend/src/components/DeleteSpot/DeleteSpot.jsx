import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spot';
import { useModal } from '../../context/Modal';
import './DeleteSpot.css'


function DeleteSpot({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteSpot(spotId));
      closeModal();
      // window.location.reload();
    } catch (err) {
      console.error('Failed to delete the spot:', err);
    }
  };

  return (
    <div className="delete-spot-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <div className="delete-spot-buttons">
        <button onClick={handleDelete} className="delete-button yes-button">
          Yes (Delete Spot)
        </button>
        <button onClick={closeModal} className="cancel-button no-button">
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteSpot;