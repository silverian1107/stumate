'use client';
import { ResourceApi } from '@/endpoints/deck-api';
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
      const response = await ResourceApi.findByOwner('decks');
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

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary-100">
        <p>No data found</p>
      </div>
    );
  }

  console.log(data);

  return (
    <>
      <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-auto auto-rows-min ">
        {data.data.map((deck: Deck) => (
          <ResourceCard
            key={deck._id}
            name={deck.name}
            description={deck.description}
          />
        ))}
      </div>
      <div className="bg-red-50 h-[36px] w-full"></div>
    </>
  );
};

export default Flashcards;
