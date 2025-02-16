'use client';

import Cookies from 'js-cookie';
import { LoaderCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAccount } from '@/hooks/use-auth';
import { useRefreshTokenQuery } from '@/service/rootApi';

import HeadingAdmin from './_components/HeadingAdmin';
import NavbarAdmin from './_components/NavbarAmin';

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState(true);
  const { data, error, isLoading } = useAccount();
  const response = useRefreshTokenQuery();
  const handleToggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const updateNavbarState = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    updateNavbarState();
    window.addEventListener('resize', updateNavbarState);

    return () => {
      window.removeEventListener('resize', updateNavbarState);
    };
  }, []);
  useEffect(() => {
    if (error) {
      if (response.data && !response.isError) {
        const newToken = response.data?.access_token;
        if (newToken) {
          Cookies.set('access_token', newToken);
        }
      } else {
        toast('Unauthorized', {
          description: 'Please login to continue',
          position: 'top-right'
        });
        redirect('/login');
      }
    }
  }, [error, response.data, response.isError]);

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center bg-primary-100">
        <LoaderCircle className="size-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="size-full relative text-sm flex flex-col">
      <HeadingAdmin
        handleToggleNavbar={handleToggleNavbar}
        id={data?.data.user._id || ''}
      />
      <div className="flex bg-primary-50 flex-1 h-[calc(100vh-64px)]">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? 'w-1/5' : 'w-[6%]'
          }`}
        >
          <NavbarAdmin isOpen={isOpen} />
        </div>
        <div
          className={`transition-all duration-300 flex-1 h-full ${
            isOpen ? 'w-4/5' : 'w-[94%]'
          }`}
        >
          <main className="flex-1 bg-primary-50 size-full flex justify-center items-center p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
