'use client';

import {
  Archive,
  ArrowRightCircle,
  Home,
  Inbox,
  LogOutIcon,
  Menu,
  PlusCircle,
  Search,
  Settings,
  Sparkle,
  Tags
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import ArchivedList from '@/components/archivedList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { useAccount } from '@/hooks/use-auth';
import { useCreateCollection } from '@/hooks/use-collection';
import { cn } from '@/lib/utils';

import DocumentList from './DocumentList';
import SidebarItem from './SidebarItem';

const Sidebar = () => {
  const pathname = usePathname();

  const { data, error, isLoading } = useAccount();
  const createCollection = useCreateCollection();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (isLoading || error || !data) {
    return null;
  }

  const handleCreate = () => {
    createCollection.mutate({ name: 'New Collection' });
  };

  return (
    <>
      {isCollapsed && (
        <Menu
          className="absolute left-2 top-1 z-10 size-6 cursor-pointer rounded-full bg-primary-100 p-1 text-primary-300 hover:bg-primary-200 hover:text-primary-800"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      )}
      <div
        className={cn(
          'bg-primary-100 transition-all duration-700 h-full flex flex-col justify-start overflow-hidden',
          isCollapsed ? 'w-0' : 'w-[240px]'
        )}
      >
        <div className="group flex h-[64px] w-full items-center justify-between px-5 text-base transition-all duration-300 hover:bg-primary-800">
          <div className="flex items-center gap-2">
            <Avatar className="border-2 border-black">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback>Jo</AvatarFallback>
            </Avatar>
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
        <div className="flex flex-col">
          <SidebarItem isButton label="Search" icon={Search} />
          <SidebarItem
            isButton
            label="Home"
            icon={Home}
            active={pathname === '/apps'}
            href="/apps"
          />
          <SidebarItem isButton label="Settings" icon={Settings} />
          <SidebarItem isButton label="Inbox" icon={Inbox} />
          <SidebarItem
            isButton
            label="Resources"
            icon={Sparkle}
            active={pathname.includes('resources')}
            href="/apps/resources/decks/view"
          />
        </div>

        {/* Separator */}
        <div className="mx-auto my-2 h-px w-4/5 bg-primary-300" />
        {/* Separator */}

        <SidebarItem
          label="New Collections"
          icon={PlusCircle}
          isButton={false}
          onClick={handleCreate}
        />
        <div className="w-full flex-1 flex flex-col overflow-auto">
          <div className="w-full overflow-auto flex-1 max-h-[320px]">
            <DocumentList />
          </div>
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
                  <SheetTitle>Archive</SheetTitle>
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
            <SidebarItem isButton label="Logout" icon={LogOutIcon} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
