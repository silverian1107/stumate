'use client';

import { useToast } from '@/hooks/use-toast';
import { useAccount } from '@/hooks/use-auth';
import Cookies from 'js-cookie';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './_components/Sidebar';

const Main = () => {
  // const isCollapsed = false;

  const { toast } = useToast();
  const router = useRouter();
  const { data, error, isLoading } = useAccount();

  useEffect(() => {
    console.log(error);

    if (error) {
      Cookies.remove('access_token');
      router.push('/login');
      toast({
        title: 'Error',
        description: 'Please login to continue',
        variant: 'destructive',
      });
    }
  }, [error, data, router, toast]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary-100">
        <LoaderCircle className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-red-50 w-full h-full relative flex text-sm">
      <Sidebar />
      <div className="flex-1 h-full bg-slate-500">
        <h1>Hello</h1>
      </div>
    </div>
  );
};

export default Main;
