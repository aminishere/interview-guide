import { configureStore, combineReducers } from "@reduxjs/toolkit";

// import slices
import sessionsReducer from "./slices/sessionsSlice";
import uiReducer from "./slices/uiSlice";
import questionsConfigReducer from "./slices/questionsConfigSlice";

const rootReducer = combineReducers({
  sessions: sessionsReducer,
  ui: uiReducer,
  
  questionsConfig: questionsConfigReducer,


  
});

export const store = configureStore({
  reducer: rootReducer,
});
