import { csrfFetch } from "./csrf";

// Action Types
const CREATE_SPOT = "spots/createSpot";
const GET_SPOT_DETAILS = "spots/getSpotDetails";
const GET_ALL_SPOTS = "spots/getAllSpots";
const UPDATE_SPOT = "spots/updateSpot";
const DELETE_SPOT = "spots/deleteSpot";
const CLEAR_ERRORS = "spots/clearErrors";

// Action Creators
export const createSpotAction = (spot) => ({
  type: CREATE_SPOT,
  payload: spot,
});

export const getSpotDetailsAction = (spot) => ({
  type: GET_SPOT_DETAILS,
  payload: spot,
});

export const getAllSpotsAction = (spots) => ({
  type: GET_ALL_SPOTS,
  payload: spots,
});

export const updateSpotAction = (spot) => ({
  type: UPDATE_SPOT,
  payload: spot,
});

export const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  payload: spotId,
});

export const clearErrorsAction = () => ({
  type: CLEAR_ERRORS,
});

// Thunks
export const createSpot =
  (spotData, imageUrls = []) =>
  async (dispatch) => {
    try {
      // Step 1: Create the spot
      const res = await csrfFetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spotData),
      });

      if (res.ok) {
        const spot = await res.json();

        // Step 2: Add images for the spot
        if (imageUrls.length > 0) {
          const imagePromises = imageUrls.map(async (url, index) => {
            const res = await csrfFetch(`/api/spots/${spot.id}/images`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url,
                preview: index === 0,
              }),
            });

            if (!res.ok) {
              const errors = await res.json();
              throw errors;
            }
            return res.json();
          });

          await Promise.all(imagePromises);
        }

        dispatch(createSpotAction(spot));
        return spot;
      } else {
        const errors = await res.json();
        throw errors;
      }
    } catch (err) {
      console.error("Error creating spot:", err);
      throw err;
    }
  };

export const getSpotDetails = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  if (res.ok) {
    const spot = await res.json();
    dispatch(getSpotDetailsAction(spot));
  }
};

export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  if (res.ok) {
    const spots = await res.json();
    dispatch(getAllSpotsAction(spots.Spots));
  }
};

export const updateSpot = (spotId, updatedSpot) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSpot),
    });

    if (res.ok) {
      const spot = await res.json();
      dispatch(updateSpotAction(spot));

      // Fetch updated spot list
      const allSpotsRes = await csrfFetch("/api/spots");
      const allSpots = await allSpotsRes.json();
      dispatch(getAllSpotsAction(allSpots.Spots));

      return spot;
    } else {
      const errors = await res.json();
      throw errors;
    }
  } catch (err) {
    console.error("Failed to update spot:", err);
    throw err;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      dispatch(deleteSpotAction(spotId));
    }
  } catch (err) {
    console.error("Failed to delete spot:", err);
    throw err;
  }
};

// Initial State
const initialState = {
  spot: null,
  spots: {},
  errors: null,
};

// Reducer
const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SPOT: {
      const newSpot = action.payload;
      return {
        ...state,
        spots: { ...state.spots, [newSpot.id]: newSpot },
        spot: newSpot,
      };
    }
    case GET_SPOT_DETAILS: {
      return {
        ...state,
        spot: action.payload,
      };
    }
    case GET_ALL_SPOTS: {
      const spots = {};
      action.payload.forEach((spot) => {
        spots[spot.id] = {
          ...spot,
          previewImage: spot.SpotImages?.[0]?.url || "/placeholder.jpg",
          avgStarRating:
            spot.avgRating === null || spot.avgRating === undefined
              ? "New"
              : spot.avgRating,
          numReviews: spot.numReviews || 0,
        };
      });

      return {
        ...state,
        spots,
      };
    }
    case UPDATE_SPOT: {
      const updatedSpot = action.payload;
      return {
        ...state,
        spots: { ...state.spots, [updatedSpot.id]: updatedSpot },
        spot: updatedSpot,
      };
    }
    case DELETE_SPOT: {
      const newSpots = { ...state.spots };
      delete newSpots[action.payload];
      return {
        ...state,
        spots: newSpots,
      };
    }
    case CLEAR_ERRORS: {
      return { ...state, errors: null };
    }
    default:
      return state;
  }
};

export default spotReducer;
