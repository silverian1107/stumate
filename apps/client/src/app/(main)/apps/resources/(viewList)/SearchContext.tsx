import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo, useState } from 'react';

// Define the context value type
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider component
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('lastStudied');

  const value = useMemo(
    () => ({ searchQuery, setSearchQuery, sortOption, setSortOption }),
    [searchQuery, sortOption]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

// Custom hook to use the Search Context
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
