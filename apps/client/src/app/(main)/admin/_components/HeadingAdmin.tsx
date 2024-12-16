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
  LogOut,
  Mail,
  Menu,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/redux/slices/authSlice';

const HeadingAdmin = ({
  handleToggleNavbar
}: {
  handleToggleNavbar: MouseEventHandler<HTMLButtonElement>;
}) => {
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
            {'Anh'[0].toUpperCase()}
          </AvatarUser>
          <p>@anhpro</p>
        </div>
        <p className="flex items-center text-xs ">
          <Mail className="mr-3 size-4" /> nguyenvantrananh@gmail.com{' '}
        </p>
        <p className="flex items-center text-xs">
          <Cake className="mr-3 size-4" /> 23/05/2003{' '}
        </p>
        <p className="flex items-center text-xs">
          <Shield className="mr-3 size-4" /> Male{' '}
        </p>
      </div>
      <MenuItem onClick={handleLogout}>
        <p className="flex gap-1 items-center text-slate-500 underline">
          <LogOut className="size-5" />
          Log out
        </p>
      </MenuItem>
    </MenuProfile>
  );
  return (
    <header className="bg-primary-200 shadow-md flex justify-between items-center px-6">
      <div className="container flex justify-between items-center text-[#212F3F] border-b border-b-[#E9EAEC] h-[64px] ">
        <div className="flex items-center w-1/5 justify-between px-6">
          <Link href="/">
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
              {/* <button
                className="flex justify-between items-center gap-5 px-5 py-1 rounded-md hover:bg-secondary z-10"
                type="button"
              >
                <IconAvatar />
                <IconDropdown className={'w-3 h-3'} />
              </button> */}
              {/* <div className="absolute after:contents w-full h-4 top-12"></div> */}
              {isHovered && (
                <div className="absolute flex flex-col items-center bg-white min-w-[200px] right-0 z-50 shadow-md rounded-md top-[54px]">
                  {/* <ItemDropdown
                    url={'/account.stacky.vn'}
                    icon={
                      <IconSignUp className={'w-6 h-6'} color={'#424242'} />
                    }
                    children={'Đăng xuất'}
                    onClick={handleLogout}
                  /> */}
                  <button type="button">Log out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <IconButton size="medium" className="!p-0">
          {/* <AccountCircle /> */}
          <AvatarUser className="!bg-primary-main">
            {'Anh'[0].toUpperCase()}
          </AvatarUser>
        </IconButton>
        <IconButton size="medium" onClick={handleUserProfileClick}>
          {/* <AccountCircle /> */}
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
