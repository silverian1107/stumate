'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { LearnerSidebar } from '@/components/sidebar/sidebar';
import { cn } from '@/lib/utils';

import MyEditor from '../_components/my-editor';
import MyMenuBar from '../_components/my-menu-bar';

export default function CreateNote() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showChevronLeft, setShowChevronLeft] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCollapsed) {
      timer = setTimeout(() => {
        setShowChevronLeft(true);
      }, 300);
    } else {
      setShowChevronLeft(false);
    }

    return () => clearTimeout(timer);
  }, [isCollapsed]);

  const handleCollapse = () => {
    setIsCollapsed(true);
    setShowChevronLeft(false);
  };

  const handleExpand = () => {
    setIsCollapsed(false);
  };

  return (
    <div className="flex h-screen w-full relative">
      <div className="flex flex-1 flex-col w-full items-start bg-gray-50/50">
        <MyMenuBar />
        <div className="flex w-full overflow-hidden gap-5">
          <MyEditor />
        </div>
      </div>

      <div
        className={cn(
          'h-full transition-all bg-white duration-500 ease-in-out relative pt-6',
          isCollapsed ? 'w-0' : 'w-[280px]'
        )}
      >
        <ChevronRight
          className={cn(
            'absolute top-2 transition-all duration-500 ease-in-out cursor-pointer z-10',
            isCollapsed ? 'left-2 rotate-180' : 'left-2 rotate-0'
          )}
          onClick={handleCollapse}
        />

        <div
          className={cn(
            'h-full transition-all duration-500 ease-in-out',
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'
          )}
        >
          <LearnerSidebar />
        </div>
      </div>

      {showChevronLeft && (
        <ChevronLeft
          className="absolute top-2 right-2 cursor-pointer transition-opacity duration-300 ease-in-out"
          onClick={handleExpand}
        />
      )}
    </div>
  );
}
