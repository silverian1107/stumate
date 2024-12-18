'use client';

import { EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import FlashcardRating from '@/components/flashcard/flashcard-rating';
import { Button } from '@/components/ui/button';
import {
  FlipCard,
  FlipCardBack,
  FlipCardFront
} from '@/components/ui/flip-card';
import { Progress } from '@/components/ui/progress';
import { useMarkFlashcard, useStudyFlashcards } from '@/hooks/use-flashcard';

// eslint-disable-next-line import/no-absolute-path

const FlashcardStudyPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: flashcards, isLoading, isError, error } = useStudyFlashcards();
  const markFlashcard = useMarkFlashcard();

  const handleNext = (rating: number) => {
    const currentFlashcard = flashcards[currentIndex];

    markFlashcard.mutate(
      { id: currentFlashcard.flashcardId._id, rating },
      {
        onSuccess: () => {
          if (currentIndex + 1 < flashcards.length) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setIsFlipped(false);
          } else {
            setIsCompleted(true);
          }
        }
      }
    );
  };

  if (isLoading) return <div>Loading flashcards...</div>;
  if (isError)
    return <div>Error loading flashcards: {(error as Error).message}</div>;

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-6 mx-auto text-center">
        <h1 className="text-4xl font-bold text-primary-600">
          Congratulations! 🎉
        </h1>
        <p className="text-lg text-gray-600">
          There are no flashcards to review at the moment.
        </p>
        <Link
          href="/apps/resources/decks/view"
          className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
        >
          Go back to decks
        </Link>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentIndex].flashcardId;
  const totalFlashcards = flashcards.length;
  const progress = ((currentIndex + 1) / totalFlashcards) * 100;

  if (isCompleted) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-6 mx-auto text-center">
        <h1 className="text-4xl font-bold text-primary-600">
          Congratulations! 🎉
        </h1>
        <p className="text-lg text-gray-600">
          You have completed all the flashcards.
        </p>
        <Link
          href="/apps/resources/decks/view"
          className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
        >
          Go back to decks
        </Link>
      </div>
    );
  }

  return (
    <div className="size-full md:w-4/5 lg:w-3/5 flex flex-col items-center gap-6 justify-center mx-auto">
      <Link
        href="/apps/resources/decks"
        className="absolute top-4 left-4 bg-white px-4 py-2 rounded-xl text-primary-600"
        prefetch
      >
        Back
      </Link>

      <div className="w-full">
        <Progress value={progress} className="h-4 rounded-lg" />
        <p className="text-sm text-gray-600 text-center mt-2">
          {currentIndex + 1} / {totalFlashcards} Flashcards
        </p>
      </div>

      <FlipCard
        className="w-4/5 h-[480px] md:h-[480px] rounded-lg"
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      >
        <FlipCardFront>{currentFlashcard.front}</FlipCardFront>
        <FlipCardBack className="rounded-2xl">
          {currentFlashcard.back}
        </FlipCardBack>
      </FlipCard>

      {!isFlipped ? (
        <Button
          type="button"
          onClick={() => setIsFlipped(true)}
          className="w-full h-16 bg-primary-200/30 text-primary-800 hover:bg-primary-200/80 transition-all duration-600 flex items-center justify-center gap-2"
        >
          <EyeIcon className="size-8" />
          Show answer
        </Button>
      ) : (
        <FlashcardRating onRate={handleNext} />
      )}
    </div>
  );
};

export default FlashcardStudyPage;
