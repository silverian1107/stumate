import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { PenLine, PlayIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { FlashcardsApi } from '@/endpoints/flashcard-api';
import { useStudyFlashcards } from '@/hooks/use-flashcard';
import type { DeckFromServer } from '@/types/deck';

const DeckCard = ({
  _id,
  name,
  description,
  studyStatus
}: Partial<DeckFromServer>) => {
  const { data, isLoading, error } = useQuery<{
    total: number;
    result: unknown[];
  }>({
    queryKey: ['flashcardsByDeckId', _id],
    queryFn: async () => {
      const response = (await FlashcardsApi.findAllInDeck(_id as string)).data;
      return response.data;
    },
    staleTime: 1000 * 60 * 5
  });

  const { data: flashcards, isLoading: flashcardsLoading } = useStudyFlashcards(
    _id as string
  );

  if (isLoading || flashcardsLoading || !data) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    DeckCardSkeleton();
  }

  if (error || !flashcards) {
    return (
      <div className="flex w-full flex-col justify-between gap-3 rounded-sm bg-white px-4 py-3 text-base">
        loading
      </div>
    );
  }

  if (!data) {
    return null;
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
            ({data.result.length} cards)
          </span>
        </h1>
        <h2 className="line-clamp-1 text-sm font-medium text-primary-950/50">
          {description}
        </h2>
      </div>
      <div className="text-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Last studied: </p>
          <h1>
            {studyStatus?.lastStudied ? (
              formatDistanceToNow(studyStatus?.lastStudied, {
                addSuffix: true
              })
            ) : (
              <span className="text-primary-600 font-bold tracking-wide">
                New
              </span>
            )}
          </h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Due today: </p>
          <h1>{flashcards.length}</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Progress: </p>
          <h1>{studyStatus?.progress}%</h1>
        </div>
      </div>
      <Progress value={studyStatus?.progress} />
      <div className="flex w-full justify-end gap-2">
        <Link href={`/apps/resources/decks/new/${_id}`}>
          <Button variant="secondary" className="px-4 hover:bg-primary-100/80">
            <PenLine /> Edit
          </Button>
        </Link>
        <Link href={`/apps/resources/decks/study/${_id}`} prefetch>
          {flashcards.length > 0 ? (
            <Button variant="default" className="px-6">
              <PlayIcon /> Study
            </Button>
          ) : !isLoading && !data.result.length ? (
            <Button variant="default" className="px-6" disabled>
              <PlayIcon /> No cards
            </Button>
          ) : (
            flashcards.length === 0 && (
              <Button variant="default" className="px-6" disabled>
                <PlayIcon /> All good
              </Button>
            )
          )}
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
