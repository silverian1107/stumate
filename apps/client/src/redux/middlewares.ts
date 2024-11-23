/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Middleware } from '@reduxjs/toolkit';

import { logout } from './slices/authSlice';
// eslint-disable-next-line import/no-cycle
import { persistor } from './store';

export const logOutMiddleware: Middleware = () => (next) => (action) => {
  // Type assertion for action as it is passed into the function
  if ((action as { type: string }).type === logout.type) {
    persistor.purge();
  }
  return next(action);
};
