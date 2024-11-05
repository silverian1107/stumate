import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAccount } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  ArrowRightCircle,
  Home,
  Inbox,
  Menu,
  PlusCircle,
  Search,
  Settings,
  Sparkle,
} from 'lucide-react';
import { useState } from 'react';
import SidebarItem from './SidebarItem';
import CollectionList from './CollectionList';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {}

const Sidebar = ({}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data, error, isLoading } = useAccount();
  const { toast } = useToast();

  if (isLoading || error || !data) {
    return null;
  }

  const handleCreate = () => {
    toast({
      title: 'Coming Soon',
      description: 'This feature will be available soon.',
      variant: 'default',
    });
  };

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
        <div className="w-full h-[64px] flex items-center justify-between px-5 hover:bg-primary-800 group transition-all duration-300 text-base">
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
        <div className="flex flex-col flex-1">
          <SidebarItem isButton label="Search" icon={Search} />
          <SidebarItem isButton label="Home" icon={Home} />
          <SidebarItem isButton label="Settings" icon={Settings} />
          <SidebarItem isButton label="Inbox" icon={Inbox} />
          <SidebarItem
            isButton
            level={1}
            label="Knowledge Base"
            icon={Sparkle}
            active
            href="/apps/knowledge-base"
          />
        </div>
        {/* Separator */}
        <div className="w-4/5 mx-auto my-2 h-[1px] bg-primary-300" />
        <SidebarItem
          label="New Collections"
          icon={PlusCircle}
          isCreate
          isButton={false}
          onClick={handleCreate}
        />
        <div className="bg-red-200 w-full h-full overflow-auto">
          <CollectionList />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
