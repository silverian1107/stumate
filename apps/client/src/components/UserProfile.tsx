'use client';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import Cookies from 'js-cookie';
import { ArrowRightCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AxiosClient } from '@/endpoints/AxiosClient';

interface UserProfileProps {
  data: {
    data: {
      user: {
        username: string;
      };
    };
  };
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  data,
  isCollapsed,
  setIsCollapsed
}) => {
  const router = useRouter();

  const handleUserProfileClick = () => {
    router.push('/apps/accounts');
  };

  const handleLogout = async () => {
    await AxiosClient.post('/auth/logout');
    Cookies.remove('access_token');
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="relative group flex h-[64px] w-full items-center justify-between px-5 text-base transition-all duration-300 hover:bg-primary-800">
      <div className="flex items-center gap-2">
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="border-2 border-black cursor-pointer">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback>Jo</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48"
              align="start"
              side="bottom"
              forceMount
            >
              <DropdownMenuItem onClick={handleUserProfileClick}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <span className="font-semibold transition-all duration-300 group-hover:text-white">
          {data.data.user.username}
        </span>
      </div>
      <button
        className="cursor-pointer"
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ArrowRightCircle className="size-5 transition-all duration-300 group-hover:text-white" />
      </button>
    </div>
  );
};

export default UserProfile;
