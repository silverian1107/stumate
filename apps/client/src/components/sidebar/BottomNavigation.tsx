'use client';

import Cookies from 'js-cookie';
import { Archive, LogOutIcon, Tags } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import ArchivedList from '@/components/archivedList';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { AxiosClient } from '@/endpoints/AxiosClient';

import SidebarItem from './SidebarItem';

const BottomNavigation = () => {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await AxiosClient.post('/auth/logout');
    Cookies.remove('access_token');
    router.push('/');
    toast.success('Logged out successfully');
  };
  return (
    <div className="mt-auto">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <div>
            <SidebarItem
              isButton
              label="Archive"
              icon={Archive}
              onClick={() => setIsSheetOpen(true)}
            />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-center">Archive</SheetTitle>
          </SheetHeader>
          <SheetDescription className="text-center">
            See your archived resources
          </SheetDescription>
          <ArchivedList />
        </SheetContent>
      </Sheet>

      <SidebarItem
        isButton
        label="Tags"
        icon={Tags}
        href="/apps/resources/tags"
      />
      <SidebarItem
        isButton
        label="Logout"
        icon={LogOutIcon}
        onClick={handleLogout}
      />
    </div>
  );
};

export default BottomNavigation;
