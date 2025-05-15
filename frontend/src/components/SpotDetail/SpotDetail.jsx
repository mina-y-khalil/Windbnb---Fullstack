import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal';
import DeleteReview from "../DeleteReview/DeleteReview";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import { getSpotDetails } from '../../store/spot'; // use Redux thunk
import { getReviews } from '../../store/reviews'; // use Redux thunk
import { createSelector } from 'reselect';// added for memoization 

import './SpotDetail.css';

const selectReviews = (spotId) =>
  createSelector(
    (state) => state.reviews.reviews,
    (reviewsBySpot) => reviewsBySpot[spotId] || []
  );

function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.spot); // use normalized state
  const reviews = useSelector(selectReviews(spotId));
  useEffect(() => {

    dispatch(getSpotDetails(spotId)); //  fetch spot details
    dispatch(getReviews(spotId));      //  fetch reviews
  }, [dispatch, spotId]);

  if (!spot) return <div>Loading...</div>;

  // Calculate average rating and review count
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? (parseFloat( // 👉 ensure it's a number before toFixed
        reviews.reduce((sum, review) => sum + review.stars, 0) / reviewCount
      ).toFixed(1))
      : "New";

  const handleReserve = () => {
    alert("Feature coming soon!");
  };

  return (
    <div className="spot-detail-page">
      {/* Header Section */}
      <div className="spot-header">
        <h1>{spot.name}</h1>
        <h2>
          {spot.city}, {spot.state}, {spot.country}
        </h2>
      </div>

      {/* Images Section */}
      <div className="spot-images">
        <div className="main-image-container">
          <img
            src={spot.SpotImages?.[0]?.url || "/placeholder.jpg"}
            alt="Main"
            className="main-image"
          />
        </div>
        <div className="thumbnail-grid">
          {spot.SpotImages?.slice(1, 5).map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className="thumbnail"
            />
          ))}
        </div>
      </div>

      <div className="content-container">
        {/* Left Side - Spot Info */}
        <div className="spot-info">
          <p>
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </p>
          <p>{spot.description}</p>
        </div>

        {/* Right Side - Reserve Box */}
        <div className="reserve-box">
          <div className="info-container">
            <span className="price">{`$${spot.price}`}</span>
            <span className="per-night">/ night</span>
            <div className="rating">
              <span>⭐️ {averageRating}</span>
              {reviewCount > 0 && (
                <span>
                  {" "}
                  · {reviewCount} Review{reviewCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
          <button onClick={handleReserve} className="reserve-button">
            Reserve
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3>
          ⭐️ {averageRating} · {reviewCount} Review{reviewCount !== 1 ? "s" : ""}
        </h3>

        {/* 👉 Only show review button if user can post */}
        {sessionUser &&
          sessionUser.id !== spot.ownerId &&
          !reviews.some((review) => review.userId === sessionUser.id) && (
            <div className="post-review-container">
              <OpenModalButton
                buttonText="Post Your Review"
                className="post-review-button"
                modalComponent={<ReviewFormModal spotId={spotId} />}
              />
            </div>
          )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
              .map((review) => (
                <div key={review.id} className="review-item">
                  <p>
                    <strong>{review.User?.firstName}</strong> -{" "}
                    {new Date(review.createdAt).toLocaleString("en-us", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>{review.review}</p>

                  {sessionUser && sessionUser.id === review.userId && (
                    <OpenModalButton
                      buttonText="Delete"
                      className="delete-review-button"
                      modalComponent={
                        <DeleteReview
                          reviewId={review.id}
                          spotId={spotId} // required to update redux
                        />
                      }
                    />
                  )}
                </div>
              ))}
          </div>
        ) : sessionUser && sessionUser.id !== spot.ownerId ? (
          <p className="no-reviews-text">Be the first to post a review!</p>
        ) : (
          <p className="no-reviews-text">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default SpotDetail;