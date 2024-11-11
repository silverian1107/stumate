'use client';
import { DeckApi } from '@/endpoints/deck-api';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import ResourceCard from '../../_components/resource-card';

interface Deck {
  _id: string;
  name: string;
  description: string;
}

const Flashcards = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['resourcesByOwner'],
    queryFn: async () => {
      const response = await DeckApi.findByOwner();
      return response.data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary-100">
        <LoaderCircle className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary-100">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (data.data.result.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary-100">
        <p>No data found</p>
      </div>
    );
  }

  const result = data.data.result;
  return (
    <>
      <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-auto auto-rows-min ">
        {result.map((deck: Deck) => (
          <ResourceCard
            key={deck._id}
            id={deck._id}
            name={deck.name}
            description={deck.description}
          />
        ))}
      </div>
    </>
  );
};

export default Flashcards;
