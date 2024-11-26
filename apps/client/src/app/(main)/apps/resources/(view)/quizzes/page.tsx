'use client';

import { LoaderCircle } from 'lucide-react';

import { useQuizzesByOwner } from '@/hooks/use-quiz';
import type { Quiz } from '@/types/deck';

import QuizCard from './quiz-card';

const Quizzes = () => {
  const { data, isLoading, error } = useQuizzesByOwner();

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

  if (!data) {
    return (
      <div className="flex size-full items-center justify-center bg-primary-100">
        <p>No quizzes found</p>
      </div>
    );
  }

  return (
    <div className="grid w-full flex-1 auto-rows-min grid-cols-1 gap-3 overflow-auto sm:grid-cols-2 lg:grid-cols-4 ">
      {data.map((quiz: Quiz) => (
        <QuizCard
          key={quiz._id}
          id={quiz._id}
          name={quiz.name}
          description={quiz.description}
        />
      ))}
    </div>
  );
};

export default Quizzes;
