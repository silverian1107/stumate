'use client';
import { useState } from 'react';
import { SearchIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import ActionButton from '../_components/action-button';
import { SlidingTabBar } from '../_components/tab';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full h-full py-4 px-2 md:py-8 md:px-8 gap-3 flex flex-col">
      <ActionButton />
      <div className="w-full flex items-center justify-between">
        <SlidingTabBar />
        <div className="h-full relative">
          <input
            className="sm:w-[240px] md:w-[360px] h-full rounded-sm border bg-inherit px-4 border-primary-950/40 focus:outline-none focus:border-primary-600 focus:border-2 text-primary-950"
            placeholder="Search..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <SearchIcon
            className={cn(
              'top-1/2 right-4 absolute -translate-y-1/2',
              isFocused ? 'text-primary-600' : 'text-primary-950/40',
            )}
          />
        </div>
      </div>
      <main className="flex-1 overflow-auto flex flex-col">{children}</main>
    </div>
  );
}
