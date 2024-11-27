'use client';

import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import ActionButton from '../_components/action-button';
import { SlidingTabBar } from '../_components/tab';

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex size-full flex-col gap-3 px-2 py-4 md:p-8">
      <ActionButton />
      <div className="flex w-full items-center justify-between">
        <SlidingTabBar />
        <div className="relative h-full">
          <input
            className="h-full rounded-sm border border-primary-600/40 bg-inherit px-4 text-primary-950 focus:border-2 focus:border-primary-600 focus:outline-none sm:w-[240px] md:w-[360px]"
            placeholder="Search..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <SearchIcon
            className={cn(
              'top-1/2 right-4 absolute -translate-y-1/2',
              isFocused ? 'text-primary-600' : 'text-primary-950/40'
            )}
          />
        </div>
      </div>
      <main className="flex flex-1 flex-col overflow-auto">{children}</main>
    </div>
  );
}
