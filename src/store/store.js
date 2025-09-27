import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// import slices
import sessionsReducer from "./slices/sessionsSlice";
import uiReducer from "./slices/uiSlice";
import questionsConfigReducer from "./slices/questionsConfigSlice";

const rootReducer = combineReducers({
  sessions: sessionsReducer,
  ui: uiReducer,
  questionsConfig: questionsConfigReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["sessions", "questionsConfig", "ui"], // what we want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
