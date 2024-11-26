'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { QuizApi } from '@/endpoints/quiz-api';
import type { Quiz } from '@/types/deck';

export const useQuizzesByOwner = () => {
  const quizzesQuery = useQuery({
    queryKey: ['quizzes'],
    queryFn: async (): Promise<Quiz[]> => {
      const response = await QuizApi.findByOwner(); // Replace with your API function
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5 // Cache data for 5 minutes
  });

  return quizzesQuery;
};

export const useQuizById = (quizId?: string) => {
  const { id } = useParams();
  const actualQuizId = quizId || (id as string);
  const fetchQuizById = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async (): Promise<Quiz> => {
      const response = await QuizApi.findById(actualQuizId);
      return response.data;
    },
    enabled: !!quizId
  });

  return fetchQuizById;
};
