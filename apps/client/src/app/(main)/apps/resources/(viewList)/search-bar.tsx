'use client';

import { Search, X } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import { useSearch } from './SearchContext';

const SearchBar: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      clearSearch();
    }
  };

  return (
    <div className="relative h-full">
      <input
        className="h-full rounded-sm border border-primary-600/40 bg-inherit px-4 text-primary-950 focus:border-2 focus:border-primary-600 focus:outline-none sm:w-[240px] md:w-[360px]"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchQuery ? (
        <X
          tabIndex={0}
          role="button"
          aria-label="Clear search"
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-primary-600 hover:text-primary-800"
          onClick={clearSearch}
        />
      ) : (
        <Search
          className={cn(
            'absolute top-1/2 right-4 -translate-y-1/2',
            isFocused ? 'text-primary-600' : 'text-primary-950/40'
          )}
        />
      )}
    </div>
  );
};

export default SearchBar;
