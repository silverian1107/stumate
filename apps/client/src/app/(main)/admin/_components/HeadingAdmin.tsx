import {
  Avatar as AvatarUser,
  IconButton,
  Menu as MenuProfile,
  MenuItem
} from '@mui/material';
import {
  Cake,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  LogOut,
  Mail,
  Menu,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/redux/slices/authSlice';
import type { UserInfo } from '@/service/rootApi';
import { useGetInfoUserQuery } from '@/service/rootApi';

const HeadingAdmin = ({
  handleToggleNavbar,
  id
}: {
  handleToggleNavbar: MouseEventHandler<HTMLButtonElement>;
  id: string;
}) => {
  const response = useGetInfoUserQuery({ id });
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (response.data) {
      setUser(response.data.data.user);
    }
  }, [response]);
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleUserProfileClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };
  const dispatch = useDispatch();

  const handleLogout = () => {
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logout());
    redirect('/');
  };

  const handleRedirectProfile = () => {
    setAnchorEl(null);
    redirect(`/admin/profile`);
  };
  const renderMenu = (
    <MenuProfile
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleMenuClose}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
    >
      <div className="w-full flex flex-col text-slate-500 px-4  space-y-2">
        <div className="flex flex-col items-center ">
          <AvatarUser className="!bg-primary-main">
            {user?.avatarUrl ? (
              <Avatar className="size-[100px]">
                <AvatarImage
                  src={user?.avatarUrl || ''}
                  alt={user?.name || ''}
                />
              </Avatar>
            ) : (
              user?.username[0]
            )}
          </AvatarUser>
          <p>@{user?.username}</p>
        </div>
        <p className="flex items-center text-xs ">
          <Mail className="mr-3 size-4" /> {user?.email}
        </p>
        <p className="flex items-center text-xs">
          <Cake className="mr-3 size-4" />{' '}
          {user?.birthday?.split('T')[0] || 'N/A'}
        </p>
        <p className="flex items-center text-xs">
          <Shield className="mr-3 size-4" /> {user?.gender || 'N/A'}
        </p>
      </div>
      <MenuItem onClick={handleRedirectProfile}>
        <p className="flex gap-3 items-center text-slate-500 underline text-sm">
          <Ellipsis className="size-4" />
          Show detail profile
        </p>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <p className="flex gap-1 items-center text-slate-500 underline">
          <LogOut className="size-5" />
          Log out
        </p>
      </MenuItem>
    </MenuProfile>
  );
  return (
    <header className="bg-primary-200 shadow-md flex justify-between items-center px-6 h-[64px]">
      <div className="container flex justify-between items-center text-[#212F3F] ">
        <div className="flex items-center w-1/5 justify-between px-6">
          <Link href="/admin">
            <Avatar className="border-2 ">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback>Jo</AvatarFallback>
            </Avatar>
          </Link>
          <button
            className="p-1 rounded-md bg-primary-100 hover:opacity-70 "
            onClick={handleToggleNavbar}
            type="button"
          >
            <Menu className="size-4" />
          </button>
        </div>
        <div className="flex justify-between items-center gap-5">
          <div className="flex items-center">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isHovered && (
                <div className="absolute flex flex-col items-center bg-white min-w-[200px] right-0 z-50 shadow-md rounded-md top-[54px]">
                  <button type="button">Log out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex ">
        <IconButton size="medium" className="!p-0">
          <AvatarUser className="!bg-primary-main">
            {user?.avatarUrl ? (
              <Avatar className="size-[100px]">
                <AvatarImage
                  src={user?.avatarUrl || ''}
                  alt={user?.name || ''}
                />
              </Avatar>
            ) : (
              user?.username[0]
            )}
          </AvatarUser>
        </IconButton>
        <IconButton size="medium" onClick={handleUserProfileClick}>
          {anchorEl ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </IconButton>
      </div>
      {renderMenu}
    </header>
  );
};

export default HeadingAdmin;
