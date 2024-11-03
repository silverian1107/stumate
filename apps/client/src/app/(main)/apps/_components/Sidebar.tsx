import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AccountResponse } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  ArrowRightCircle,
  Home,
  Inbox,
  Menu,
  Search,
  Settings,
  Sparkle,
} from 'lucide-react';
import { useState } from 'react';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  data: AccountResponse;
}
const Sidebar = ({ data }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <>
      {isCollapsed && (
        <Menu
          className="absolute top-5 left-5 w-8 h-8 text-primary-200 hover:text-primary-500 cursor-pointer p-1 rounded-full hover:bg-primary-50 "
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      )}
      <div
        className={cn(
          'bg-primary-100 transition-all duration-700',
          isCollapsed ? 'w-0 h-full overflow-hidden' : 'w-[240px] h-full',
        )}
      >
        <div className="w-full h-[64px] flex items-center justify-between px-5 hover:bg-primary-800 group transition-all duration-300">
          <div className="flex items-center gap-2">
            <Avatar className="border-black border-2">
              <AvatarImage src="avatar.jpg" />
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
        <div className="flex flex-col flex-1 mt-2">
          <SidebarItem label="Search" icon={Search} />
          <SidebarItem label="Home" icon={Home} />
          <SidebarItem label="Settings" icon={Settings} />
          <SidebarItem label="Inbox" icon={Inbox} />
          <SidebarItem label="Knowledge Base" icon={Sparkle} active />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
