import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spot';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import './SpotList.css';


//  Memoized selector to avoid returning new array every time
const selectSpotsObj = state => state.spots.spots;
const selectSpots = createSelector(
  [selectSpotsObj],
  spotsObj => Object.values(spotsObj)
);


const SpotList = () => {
  const dispatch = useDispatch(); //Get Redux dispatcher
  const spots = useSelector(selectSpots);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    const fetchSpots = async () => {
      await dispatch(getAllSpots()); // ➡️ Wait for Redux to load spots
      setIsLoaded(true); // ➡️ Set loading state after Redux call
    };

    fetchSpots(); // ➡️ Always fetch on mount (don't rely on Redux to know if empty)
  }, [dispatch]);

  if (!isLoaded) {
    return <div className="loading">Loading spots...</div>; // ➡️ Show loading until local flag is true
  }
  return (
    <div className="spot-list">
      {spots.length > 0 ? (
        spots.map((spot) => (
          <Link to={`/spots/${spot.id}`} key={spot.id} className="spot-tile" title={spot.name}>
            <img
              src={spot.previewImage || '/default-image.png'}
              alt={spot.name}
              className="spot-image"
            />
            <div className="spot-info">
              <div className="spot-header">
                <h2 className="spot-name" title={spot.name}>{spot.name}</h2>
                <div className="spot-rating">
                  <span className="star-icon">⭐️</span>
                  {typeof spot.avgStarRating === "number"
                    ? spot.avgStarRating.toFixed(1)
                    : "New"} {/* */}
                  {spot.numReviews > 0 ? `· ${spot.numReviews} Review${spot.numReviews > 1 ? "s" : ""}` : ""}
                </div>
              </div>
              <p className="spot-location">
                {spot.city}, {spot.state}
              </p>
              <p className="spot-price">${spot.price} / night</p>
            </div>
          </Link>
        ))
      ) : (
        <p className='no-spots-message'>No spots available</p>
      )}
    </div>
  );
};

export default SpotList;