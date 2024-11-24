import { ArrowRight, LoaderCircle } from 'lucide-react';
import Link from 'next/link';

import { useAccount } from '@/hooks/use-auth';

import { Button } from './ui/button';

const LoginStatus = () => {
  const { data, isLoading, error } = useAccount();

  if (isLoading) {
    return (
      <Button variant="default" className="w-[80px] px-8">
        <LoaderCircle className="animate-spin text-center text-primary-800" />
      </Button>
    );
  }

  if (error || !data) {
    return (
      <>
        <Link href="/login" className="text-gray-600 hover:text-primary ">
          <Button
            variant="secondary"
            className="px-2 hover:bg-primary-100 hover:text-primary-800"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/register" className="group">
          <Button
            variant="ringHover"
            className="bg-primary-700 px-6 py-2 uppercase hover:bg-primary-600"
          >
            Register
          </Button>
        </Link>
      </>
    );
  }

  return (
    <Link href="/apps" className="group">
      <Button
        variant="ringHover"
        className="bg-primary-700 px-6 py-2 uppercase hover:bg-primary-600 "
      >
        To dashboard
        <ArrowRight className="-ml-1 hover:ml-2" />
      </Button>
    </Link>
  );
};

export default LoginStatus;
