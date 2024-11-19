'use client';

import { useAccount } from '@/hooks/use-auth';
import Cookies from 'js-cookie';
import { CloudSun, LayoutGrid, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
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
        position: 'top-right',
      });
    }
  }, [error, data, router]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary-100">
        <LoaderCircle className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex-1 h-full bg-primary-50">
      <div className="h-[72px] w-full bg-primary-50 flex justify-between items-end py-2 px-4">
        <div className="text-primary-950/40 bg-primary-50 border border-primary-950/40 hover:bg-primary-100 hover:border-primary-800 hover:text-primary-800 flex items-center gap-1 px-2 py-1 rounded-sm cursor-pointer">
          Customized
          <span>
            <LayoutGrid className="w-4 h-4" />
          </span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span>
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <IconWrapper icon={CloudSun} />
          </div>
          <div>
            <h1 className="font-bold text-2xl">
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
