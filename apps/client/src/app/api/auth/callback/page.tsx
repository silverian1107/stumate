'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { login as loginState } from '@/redux/slices/authSlice';
import { openSnackbar } from '@/redux/slices/snackbarSlice';

export default function AuthCallback() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('Processing login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        // const refreshToken = searchParams.get('refresh_token');
        const provider = urlParams.get('provider');

        if (!accessToken || !provider) {
          throw new Error('Missing authentication parameters');
        }

        dispatch(
          loginState({
            accessToken,
            refreshToken: ''
          })
        );

        Cookies.set('access_token', accessToken, {
          expires: 30 * 1000 * 60
        });

        dispatch(
          openSnackbar({
            type: 'success',
            message: `Successfully logged in with ${provider}`
          })
        );

        setStatus('Login successful. Redirecting...');

        setTimeout(() => {
          router.push('/apps');
        }, 2000);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Authentication error:', error);
        dispatch(
          openSnackbar({
            type: 'error',
            message: 'Authentication failed'
          })
        );
        setStatus('Login failed. Redirecting to login page...');
        setTimeout(() => {
          router.push('/login?error=auth_failed');
        }, 2000);
      }
    };

    handleCallback();
  }, [router, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">{status}</h2>
        <div className="animate-spin rounded-full size-8 border-b-2 border-primary mx-auto" />
      </div>
    </div>
  );
}
