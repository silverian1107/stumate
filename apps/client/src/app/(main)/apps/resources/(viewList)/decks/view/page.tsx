'use client';

import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';

import { DeckApi } from '@/endpoints/deck-api';

import ResourceCard from '../../../_components/resource-card';

interface Deck {
  _id: string;
  name: string;
  description: string;
}

const Flashcards = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: async () => {
      const response = await DeckApi.findByOwner();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false
  });

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center bg-primary-100">
        <LoaderCircle className="size-16 animate-spin" />
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

  if (data.data.result.length === 0) {
    return (
      <div className="flex text-lg size-full items-center justify-center flex-col font-medium">
        <p>No deck found</p>
        <p>
          Let&apos;s get started by{' '}
          <Link
            href="new"
            className="text-primary-600 cursor-pointer font-bold hover:underline"
          >
            create a new deck
          </Link>
        </p>
      </div>
    );
  }

  const { result } = data.data;
  return (
    <div className="grid w-full flex-1 auto-rows-min grid-cols-1 gap-3 overflow-auto sm:grid-cols-2 xl:grid-cols-4">
      {result.map((deck: Deck) => (
        <ResourceCard
          key={deck._id}
          id={deck._id}
          name={deck.name}
          description={deck.description}
        />
      ))}
    </div>
  );
};

export default Flashcards;
