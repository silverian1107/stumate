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
import { useCallback, useEffect, useState } from 'react';

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
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

import DocumentList from './DocumentList';
import SidebarItem from './SidebarItem';

const Sidebar = () => {
  const pathname = usePathname();
  const { data, error, isLoading } = useAccount();
  const createCollection = useCreateCollection();

  const isTablet = useMediaQuery('(max-width: 768px)');

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = Math.max(200, Math.min(480, e.clientX));
      setSidebarWidth(newWidth);
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isTablet) {
      setIsCollapsed(true);
    }
  }, [isTablet]);

  if (isLoading || error || !data) {
    return null;
  }

  const handleCreate = () => {
    createCollection.mutate({ name: 'New Collection' });
  };

  const sidebarContent = (
    <>
      {/* User Profile Section */}
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

      {/* Main Navigation Items */}
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

      {/* Collections Section */}
      <SidebarItem
        label="New Collections"
        icon={PlusCircle}
        isButton={false}
        onClick={handleCreate}
      />

      {/* Document List and Bottom Items */}
      <div className="w-full flex-1 flex flex-col overflow-auto">
        <div className="w-full overflow-auto flex-1 max-h-[320px]">
          <DocumentList />
        </div>

        {/* Bottom Navigation Items */}
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

      {/* Resize Handle */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={cn(
          'absolute right-0 top-0 h-full w-1 cursor-ew-resize hover:bg-primary-300',
          isResizing ? 'bg-primary-300' : 'bg-transparent'
        )}
        onMouseDown={handleMouseDown}
      />
    </>
  );

  return (
    <>
      {isCollapsed && (
        <Menu
          className="absolute left-2 top-1 z-10 size-6 cursor-pointer rounded-full bg-primary-100 p-1 text-primary-300 hover:bg-primary-200 hover:text-primary-800"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      )}
      {isTablet ? (
        <>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className={cn(
              'fixed inset-0 z-40 bg-black bg-opacity-50',
              isCollapsed && 'hidden'
            )}
            onClick={() => setIsCollapsed(true)}
          />
          <div
            className={cn(
              'fixed left-0 top-0 z-50 h-full bg-primary-100 transition-transform duration-300',
              isCollapsed ? '-translate-x-full' : 'translate-x-0'
            )}
            style={{ width: sidebarWidth }}
          >
            {sidebarContent}
          </div>
        </>
      ) : (
        <div
          className={cn(
            'bg-primary-100 h-full flex flex-col justify-start relative',
            isCollapsed ? 'w-0' : '',
            isResizing ? 'transition-none' : 'transition-all duration-700',
            'select-none'
          )}
          style={{ width: isCollapsed ? 0 : sidebarWidth }}
        >
          {sidebarContent}
        </div>
      )}
    </>
  );
};

export default Sidebar;
