'use client';

import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { closeSnackbar } from '@/redux/slices/snackbarSlice';
import type { RootState } from '@/redux/store';

export default function SnackBar() {
  const dispatch = useDispatch();
  const { open, type, message } = useSelector((state: RootState) => {
    return state.snackbar;
  });
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => {
        dispatch(closeSnackbar());
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        // onClose={handleClose}
        severity={type as 'error' | 'success' | 'warning'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
