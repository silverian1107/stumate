/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// Define the types for the initial state
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: Record<string, any>; // Update this to a more specific type if available
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userInfo: {}
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Define types for action payloads
    login: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: () => initialState,
    saveUserInfo: (state, action: PayloadAction<Record<string, any>>) => {
      state.userInfo = action.payload;
    }
  }
});

// Export actions and reducer
export const { login, logout, saveUserInfo } = authSlice.actions;
export default authSlice.reducer;
