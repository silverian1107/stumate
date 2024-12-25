'use client';

import { Menu } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import BottomNavigation from '@/components/sidebar/BottomNavigation';
import CollectionsSection from '@/components/sidebar/CollectionsSection';
import DocumentList from '@/components/sidebar/DocumentList';
import MainNavigation from '@/components/sidebar/MainNavigation';
import ResizeHandle from '@/components/sidebar/ResizeHandle';
import UserProfile from '@/components/UserProfile';
import { useAccount } from '@/hooks/use-auth';
import { useCreateCollection } from '@/hooks/use-collection';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { data, error, isLoading } = useAccount();
  const createCollection = useCreateCollection();
  const isTablet = useMediaQuery('(max-width: 768px)');

  const [isCollapsed, setIsCollapsed] = useState(false);
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
      <UserProfile
        data={data}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <MainNavigation />
      <div className="mx-auto my-2 h-px w-4/5 bg-primary-300" />
      <CollectionsSection handleCreate={handleCreate} />
      <div className="w-full flex-1 flex flex-col overflow-auto">
        <div className="w-full overflow-auto flex-1 max-h-[320px]">
          <DocumentList parentDocumentId={undefined} />
        </div>
        <BottomNavigation />
      </div>
      <ResizeHandle isResizing={isResizing} handleMouseDown={handleMouseDown} />
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
