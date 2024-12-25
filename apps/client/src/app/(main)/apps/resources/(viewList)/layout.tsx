'use client';

import ActionButton from '../_components/action-button';
import { SlidingTabBar } from '../_components/tab';
import SearchBar from './search-bar';
import { SearchProvider } from './SearchContext';

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SearchProvider>
      <div className="flex size-full flex-col gap-3 px-2 py-4 md:p-8">
        <ActionButton />
        <div className="flex w-full items-center justify-between">
          <SlidingTabBar />
          <SearchBar />
        </div>
        <main className="flex flex-1 flex-col overflow-auto">{children}</main>
      </div>
    </SearchProvider>
  );
}
