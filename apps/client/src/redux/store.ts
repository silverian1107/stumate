import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import snackbarReducer from './slices/snackbarSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { rootApi } from '../service/rootApi';
import { logOutMiddleware } from './middlewares';
import DecksReducer from './slices/resourceSlice';

// Type for persisted configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whiteList: ['auth'],
};

// Persist the authReducer with the given configuration
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    snackbar: snackbarReducer,
    decks: DecksReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  }),
);

// Configure the store with persistedReducer and middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logOutMiddleware, rootApi.middleware),
});

export const persistor = persistStore(store);
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore['dispatch'];
