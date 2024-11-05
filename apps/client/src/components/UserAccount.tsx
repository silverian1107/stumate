import { useAccount } from '@/hooks/use-auth';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
const LoginStatus = () => {
  const { data, isLoading, error } = useAccount();
  console.log(data);

  if (isLoading) {
    return (
      <Button variant={'default'} className="px-8 w-[80px]">
        <LoaderCircle className="text-center animate-spin text-primary-800" />
      </Button>
    );
  }

  if (error || !data) {
    return (
      <>
        {' '}
        <Link href="/login" className="text-gray-600 hover:text-primary ">
          <Button
            variant="secondary"
            className="hover:bg-primary-100 px-2 hover:text-primary-800"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/register" className="group">
          <Button
            variant={'ringHover'}
            className="bg-primary-700 px-6 uppercase py-2 hover:bg-primary-600"
          >
            Register
          </Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/apps" className="group">
        <Button
          variant={'ringHover'}
          className="bg-primary-700 px-6 uppercase py-2 hover:bg-primary-600 "
        >
          To dashboard
          <ArrowRight className="-ml-1 hover:ml-2" />
        </Button>
      </Link>
    </>
  );
};

export default LoginStatus;
