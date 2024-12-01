'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import type { QuizCreateDto, QuizQuestion } from '@/endpoints/quiz-api';
import { QuizApi } from '@/endpoints/quiz-api';
import type { Quiz } from '@/types/deck';

export const useQuizzesByOwner = () => {
  const quizzesQuery = useQuery({
    queryKey: ['quizzes'],
    queryFn: async (): Promise<Quiz[]> => {
      const response = await QuizApi.findByOwner();
      return response.data.data.result;
    },
    staleTime: 1000 * 60 * 5
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
      return response.data.data;
    },
    enabled: !!quizId,
    staleTime: 1000 * 60 * 5
  });

  return fetchQuizById;
};

export const useQuizCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['quizzes'],
    mutationFn: async (data: QuizCreateDto) => {
      const response = await QuizApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes']
      });
    }
  });
};

export const useCreateQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['quizzes'],
    mutationFn: async (data: { quizId: string; questions: QuizQuestion[] }) => {
      const response = await QuizApi.bulkCreateQuestions(
        data.quizId,
        data.questions
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes']
      });
    }
  });
};
