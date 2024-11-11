'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAccount } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  Archive,
  ArrowRightCircle,
  CircleHelp,
  Home,
  Inbox,
  Menu,
  PlusCircle,
  Search,
  Settings,
  Sparkle,
  Tags,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import DocumentList from './DocumentList';
import SidebarItem from './SidebarItem';
import { toast } from 'sonner';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data, error, isLoading } = useAccount();

  if (isLoading || error || !data) {
    return null;
  }

  const handleCreate = () => {
    toast('Coming Soon', {
      description: 'This feature will be available soon.',
    });
  };

  return (
    <>
      {isCollapsed && (
        <Menu
          className="absolute top-1 left-2 w-6 h-6 text-primary-300 bg-primary-100 hover:text-primary-800 cursor-pointer p-1 rounded-full hover:bg-primary-200 z-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      )}
      <div
        className={cn(
          'bg-primary-100 transition-all duration-700 h-full flex flex-col justify-start overflow-hidden',
          isCollapsed ? 'w-0' : 'w-[240px]',
        )}
      >
        <div className="w-full h-[64px] flex items-center justify-between px-5 hover:bg-primary-800 group transition-all duration-300 text-base">
          <div className="flex items-center gap-2">
            <Avatar className="border-black border-2">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback>Jo</AvatarFallback>
            </Avatar>
            <span className="font-semibold group-hover:text-white transition-all duration-300">
              {data.data.user.username}
            </span>
          </div>
          <span
            className="cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ArrowRightCircle className="w-5 h-5 group-hover:text-white transition-all duration-300" />
          </span>
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
            href="/apps/resources/decks"
          />
        </div>

        {/* Separator */}
        <div className="w-4/5 mx-auto my-2 h-[1px] bg-primary-300" />
        {/* Separator */}

        <SidebarItem
          label="New Collections"
          icon={PlusCircle}
          isCreate
          isButton={false}
          onClick={handleCreate}
        />
        <div className="w-full flex-1 flex flex-col">
          <div className="w-full overflow-auto flex-1">
            <DocumentList />
          </div>
          <div>
            <SidebarItem isButton label="Archive" icon={Archive} />
            <SidebarItem isButton label="Tags" icon={Tags} />
            <SidebarItem isButton label="Guide" icon={CircleHelp} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
