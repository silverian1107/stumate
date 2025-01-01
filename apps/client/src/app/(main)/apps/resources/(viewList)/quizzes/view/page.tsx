'use client';

import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { useQuizzesByOwner } from '@/hooks/quiz/use-quiz';
import type { Quiz } from '@/types/deck';

import { useSearch } from '../../SearchContext';
import QuizCard from './quiz-card';

const Quizzes: React.FC = () => {
  const { data, isLoading, error } = useQuizzesByOwner();
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

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

  if (!data || data.length === 0) {
    return (
      <div className="flex text-lg size-full items-center justify-center flex-col font-medium">
        <p>No quiz found</p>
        <p>
          Let&apos;s get started by{' '}
          <Link
            href="new"
            className="text-primary-600 cursor-pointer font-bold hover:underline"
          >
            create a new quiz
          </Link>
        </p>
      </div>
    );
  }

  const filteredAndSortedData = data.filter((quiz: Quiz) =>
    quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  //   .sort((a: Quiz, b: Quiz) => {
  //     if (sortOption === 'name') {
  //       return a.name.localeCompare(b.name);
  //     }
  //     if (sortOption === 'updatedAt' || sortOption === 'lastStudied') {
  //       return (
  //         new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  //       );
  //     }
  //     return 0;
  //   });

  return (
    <div className="grid w-full flex-1 auto-rows-min grid-cols-1 gap-3 overflow-auto sm:grid-cols-2 xl:grid-cols-4">
      {filteredAndSortedData.map((quiz: Quiz) => (
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
