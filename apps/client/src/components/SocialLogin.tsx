// components/SocialLogin.tsx

'use client';

import { Button } from '@mui/material';
import { FacebookIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';

export default function SocialLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href =
      'http://localhost:3000/api/auth/google/login?redirect=http://localhost:3001/api/auth/callback';
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    window.location.href = 'http://localhost:3000/api/auth/facebook/login';
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <Button
        onClick={() => handleFacebookLogin()}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        <FacebookIcon />
        {isLoading ? 'Logging in...' : 'Login With Facebook'}
      </Button>
      <Button
        onClick={() => handleGoogleLogin()}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        <MailIcon />
        {isLoading ? 'Logging in...' : 'Login with Google'}
      </Button>
    </div>
  );
}
