import { configureStore } from "@reduxjs/toolkit";
import spotsReducer from "./spots";
import sessionReducer from "./session";

const store = configureStore({
  reducer: {
    session: sessionReducer,
    spots: spotsReducer,
  },
});

export default store;
