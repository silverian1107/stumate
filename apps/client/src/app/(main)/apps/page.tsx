'use client';

import { useAccount } from '@/hooks/use-auth';
import Cookies from 'js-cookie';
import {
  CloudSun,
  LayoutGrid,
  LoaderCircle,
  MoreHorizontalIcon,
} from 'lucide-react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import IconWrapper from './_components/IconWrapper';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
    <div className="flex-1 flex h-screen bg-primary-50 flex-col box-border">
      <div className="h-[72px] w-full bg-primary-50 flex justify-between  py-2 px-10 items-center">
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
      <div className="flex flex-1 gap-4 w-full   px-10 pb-7">
        <div className=" w-3/4 h-full  grid grid-cols-3 grid-rows-5 gap-4 box-border ">
          <div className="element-dashboard">
            <div className="flex text-xs">
              <p className="font-bold text-primary-950 mr-1">Short session </p>
              <p className="text-gray-500 mr-7">Long Break</p>
              <MoreHorizIcon fontSize="small" />
            </div>
            <div className="flex flex-col gap-1 items-center">
              <div className="relative">
                <p className="font-bold text-4xl text-primary-500">25:00</p>
                <RefreshIcon
                  fontSize="small"
                  color="primary"
                  className="absolute top-[10px] right-[-25px]"
                />
              </div>
              <Button>Start</Button>
            </div>
          </div>
          <div className="element-dashboard">2</div>
          <div className=" element-dashboard">3</div>
          <div className="element-dashboard row-span-2 ">4</div>
          <div className="element-dashboard">5</div>
          <div className=" element-dashboard">6</div>
          <div className=" element-dashboard col-span-2 ">7</div>
          <div className=" element-dashboard row-span-2 col-span-3 ">8</div>
        </div>
        <div className=" w-1/4 h-full grid grid-cols-1 gap-4  box-border">
          <div className="element-dashboard"></div>
          <div className="element-dashboard"></div>
        </div>
      </div>
    </div>
  );
};

export default Main;
