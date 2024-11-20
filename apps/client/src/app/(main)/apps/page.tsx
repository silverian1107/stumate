'use client';

import Cookies from 'js-cookie';
import { CloudSun, LayoutGrid, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useAccount } from '@/hooks/use-auth';

import IconWrapper from './_components/IconWrapper';

const Main = () => {
  const router = useRouter();
  const { data, error, isLoading } = useAccount();

  useEffect(() => {
    console.log(error);

    if (error) {
      Cookies.remove('access_token');
      router.push('/login');
      toast('Unauthorized', {
        description: 'Please login to continue',
        position: 'top-right'
      });
    }
  }, [error, data, router]);

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center bg-primary-100">
        <LoaderCircle className="size-16 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="h-full flex-1 bg-primary-50">
      <div className="flex h-[72px] w-full items-end justify-between bg-primary-50 px-4 py-2">
        <div className="flex cursor-pointer items-center gap-1 rounded-sm border border-primary-950/40 bg-primary-50 px-2 py-1 text-primary-950/40 hover:border-primary-800 hover:bg-primary-100 hover:text-primary-800">
          Customized
          <span>
            <LayoutGrid className="size-4" />
          </span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span>
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <IconWrapper icon={CloudSun} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Morning, {data.data.user.username}
            </h1>
          </div>
        </div>
      </div>

      {/* <div className="grid lg:grid-cols-4 gap-4 w-full h-[calc(100%-72px)] px-4 md:grid-cols-2 grid-cols-1 [&>*]:h-[172px] overflow-auto"></div> */}
    </div>
  );
};

export default Main;
