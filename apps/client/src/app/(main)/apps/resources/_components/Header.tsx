import { CloudSun, LayoutGrid } from 'lucide-react';
import React from 'react';

import IconWrapper from '@/components/IconWrapper';

const Header = ({ username }: { username: string }) => {
  return (
    <div className="h-[72px] w-full bg-primary-50 flex justify-between  py-2 px-10 items-center">
      <div className="text-primary-950/40 bg-primary-50 border border-primary-950/40 hover:bg-primary-100 hover:border-primary-800 hover:text-primary-800 flex items-center gap-1 px-2 py-1 rounded-sm cursor-pointer">
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
          <h1 className="font-bold text-2xl">Morning, {username}</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
