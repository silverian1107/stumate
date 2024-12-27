'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useDeckByOwner } from '@/hooks/use-deck';

import DeckCard from '../../../_components/deck-card';
import { useSearch } from '../../SearchContext';

interface Deck {
  _id: string;
  name: string;
  description: string;
}

const DeckPage = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  const { data, isLoading, error } = useDeckByOwner();

  useEffect(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  if (isLoading) {
    return (
      <div className="grid w-full flex-1 auto-rows-min grid-cols-1 gap-3 overflow-auto sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={index} className="h-64 w-full bg-gray-200" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex size-full items-center justify-center bg-primary-100">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (data.result.length === 0) {
    return (
      <div className="flex text-lg size-full items-center justify-center flex-col font-medium">
        <p>No deck found</p>
        <p>
          Let&apos;s get started by{' '}
          <Link
            href="new"
            className="text-primary-600 cursor-pointer font-bold hover:underline"
          >
            creating a new deck
          </Link>
        </p>
      </div>
    );
  }

  const { result } = data;

  const filteredDecks = result.filter((deck: Deck) =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid w-full flex-1 auto-rows-min grid-cols-1 gap-3 overflow-auto sm:grid-cols-2 xl:grid-cols-4">
      {filteredDecks.map((deck: Deck) => (
        <DeckCard
          key={deck._id}
          id={deck._id}
          name={deck.name}
          description={deck.description}
        />
      ))}
    </div>
  );
};

export default DeckPage;
