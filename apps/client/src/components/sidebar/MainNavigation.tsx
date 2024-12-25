import { Home, Inbox, Search, Settings, Sparkle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import SearchDialog from './SearchDialog';
import SidebarItem from './SidebarItem';

const MainNavigation = () => {
  const pathname = usePathname();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchDialogOpen(true);
  };

  const closeSearchDialog = () => {
    setIsSearchDialogOpen(false);
  };

  return (
    <div className="flex flex-col">
      <SidebarItem
        isButton
        label="Search"
        icon={Search}
        onClick={handleSearchClick}
      />
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
      <SearchDialog isOpen={isSearchDialogOpen} onClose={closeSearchDialog} />
    </div>
  );
};

export default MainNavigation;
