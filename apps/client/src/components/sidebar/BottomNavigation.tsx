import { Archive, LogOutIcon, Tags } from 'lucide-react';
import { useState } from 'react';

import ArchivedList from '@/components/archivedList';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

import SidebarItem from './SidebarItem';

const BottomNavigation = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
  );
};

export default BottomNavigation;
