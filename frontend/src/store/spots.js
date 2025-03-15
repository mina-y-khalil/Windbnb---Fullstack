// ---- Action Types ----
const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";

// ---- Action Creators ----
export const getAllSpots = (spots) => ({
  type: GET_ALL_SPOTS,
  payload: spots,
});

// ---- Thunk: Fetch All Spots ----
export const fetchAllSpots = () => async (dispatch) => {
  try {
    const response = await fetch("/api/spots");
    if (!response.ok) throw new Error("Failed to fetch spots");

    const data = await response.json();
    console.log("Fetched spots:", data);
    dispatch(getAllSpots(data.Spots));
  } catch (error) {
    console.error("Error fetching spots:", error);
  }
};

// ---- Reducer ----
const initialState = {
  allIds: [],
  byId: {},
};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const spots = action.payload;
      const newState = {
        allIds: spots.map((spot) => spot.id),
        byId: spots.reduce((acc, spot) => {
          acc[spot.id] = spot;
          return acc;
        }, {}),
      };
      return { ...state, ...newState };
    }
    default:
      return state;
  }
};

export default spotReducer;
