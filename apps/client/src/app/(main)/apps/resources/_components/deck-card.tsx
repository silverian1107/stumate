import { useQuery } from '@tanstack/react-query';
import { PenLine, PlayIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { FlashcardsApi } from '@/endpoints/flashcard-api';

interface ResourceCardProps {
  id: string;
  name: string;
  description: string;
}

const DeckCard = ({ id, name, description }: ResourceCardProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['flashcardsByDeckId', id],
    queryFn: async () => {
      const response = (await FlashcardsApi.findAllInDeck(id)).data;
      return response.data;
    },
    staleTime: 1000 * 60 * 5
  });

  if (isLoading) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    DeckCardSkeleton();
  }

  if (error || !data) {
    return (
      <div className="flex w-full flex-col justify-between gap-3 rounded-sm bg-white px-4 py-3 text-base">
        <h1 className="text-red-500">Failed to load flashcards</h1>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col justify-between gap-3 rounded-sm bg-white px-4 py-3 text-base">
      <div className="flex w-full items-center justify-end gap-1">
        <div className="rounded-md bg-primary-100 px-3 py-1 text-xs font-bold text-primary-400">
          Mathematics
        </div>
        <div className="rounded-md bg-primary-100 px-3 py-1 text-xs font-bold text-primary-400">
          Algorithm
        </div>
      </div>
      <div className="text-sm">
        <h1 className="-mb-1 text-xl font-bold line-clamp-2">
          {name}{' '}
          <span className="text-lg font-semibold text-primary-600 ">
            {/* ({data.length} cards) */}
          </span>
        </h1>
        <h2 className="line-clamp-1 text-sm font-medium text-primary-950/50">
          {description}
        </h2>
      </div>
      <div className="text-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Last studied: </p>
          <h1>2 days ago</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Due today: </p>
          <h1>25</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Progress: </p>
          <h1>75%</h1>
        </div>
      </div>
      <Progress value={75} />
      <div className="flex w-full justify-end gap-2">
        <Link href={`/apps/resources/decks/new/${id}`}>
          <Button variant="secondary" className="px-4 hover:bg-primary-100/80">
            <PenLine /> Edit
          </Button>
        </Link>
        <Link href={`/apps/resources/decks/study/${id}`} prefetch>
          <Button variant="default" className="px-6">
            <PlayIcon /> Study
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DeckCard;

const DeckCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col justify-between gap-3 rounded-sm bg-white px-4 py-3 text-base">
      <div className="flex w-full items-center justify-end gap-1">
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
      <div className="text-sm">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/2 mt-1" />
      </div>
      <div className="text-sm mt-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Last studied: </p>
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="font-semibold text-primary-950/50">Due today: </p>
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="font-semibold text-primary-950/50">Progress: </p>
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mt-3" />
      <Skeleton className="h-4 w-full mt-1" />
      <div className="flex w-full justify-end gap-2 mt-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
};
