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

const flashcards = [
  { question: 'Question 1', answer: 'Answer 1' },
  { question: 'Question 2', answer: 'Answer 2' },
  { question: 'Question 3', answer: 'Answer 3' }
];

const FlashcardStudyPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalFlashcards = flashcards.length;
  const progress = ((currentIndex + 1) / totalFlashcards) * 100;

  const handleNext = (rating: number) => {
    // eslint-disable-next-line no-console
    console.log('Selected rating:', rating);

    if (currentIndex + 1 < flashcards.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsFlipped(false);
    } else {
      setIsCompleted(true);
    }
  };

  const currentFlashcard = flashcards[currentIndex];

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
          href="/apps/resources/decks"
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
        className="w-full h-[480px] md:w-4/5 md:h-[480px] lg:w-3/5 rounded-lg"
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      >
        <FlipCardFront>{currentFlashcard.question}</FlipCardFront>
        <FlipCardBack className="rounded-2xl">
          {currentFlashcard.answer}
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
