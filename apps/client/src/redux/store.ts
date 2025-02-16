import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { rootApi } from '../service/rootApi';
// eslint-disable-next-line import/no-cycle
import { logOutMiddleware } from './middlewares';
import authReducer from './slices/authSlice';
import QuizReducer from './slices/quizSlice';
import DecksReducer from './slices/resourceSlice';
import snackbarReducer from './slices/snackbarSlice';
import QuizStudyReducer from './slices/studyQuizSlice';

// Type for persisted configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whiteList: ['auth']
};

// Persist the authReducer with the given configuration
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    snackbar: snackbarReducer,
    decks: DecksReducer,
    quiz: QuizReducer,
    quizStudy: QuizStudyReducer,
    [rootApi.reducerPath]: rootApi.reducer
  })
);

// Configure the store with persistedReducer and middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(logOutMiddleware, rootApi.middleware)
});

export const persistor = persistStore(store);
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore['dispatch'];
