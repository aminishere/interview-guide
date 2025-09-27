import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    // empty for now; slices come in Phase 1
  });

  const persistConfig = {
    key: "root",
    storage,
    whitelist: [], // add slice names later
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  export const store = configureStore({
    reducer: persistedReducer,
  });

  export const persistor = persistStore(store);