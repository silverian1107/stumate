'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { QuizApi } from '@/endpoints/quiz/quiz-api';
import type { QuizCreateDto, QuizQuestion } from '@/endpoints/quiz/type';
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
  const { id: routeIds } = useParams<{ id: string }>();

  const actualQuizId = quizId || routeIds;

  const fetchQuizById = useQuery({
    queryKey: ['quizzes', actualQuizId],
    queryFn: async (): Promise<Quiz> => {
      if (!actualQuizId) {
        throw new Error('No quiz ID provided');
      }

      const response = await QuizApi.findById(actualQuizId);
      return response.data.data;
    },
    enabled: !!actualQuizId,
    staleTime: 1000 * 60 * 5
  });

  return fetchQuizById;
};

export const useQuizByNoteId = () => {
  const { id: noteId } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ['quizzes', noteId],
    queryFn: async (): Promise<Quiz> => {
      if (!noteId) {
        throw new Error('No note ID provided');
      }
      const response = await QuizApi.findByNoteId(noteId);
      return response.data.data;
    }
  });
};

export const useQuizQuestions = (quizId?: string) => {
  const { id: routeIds } = useParams<{ id: string }>();
  const actualQuizId = quizId || routeIds;
  const quizQuestionsQuery = useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: async (): Promise<QuizQuestion[]> => {
      if (!actualQuizId) {
        throw new Error('No quiz ID provided');
      }
      const response = await QuizApi.findByQuizId(actualQuizId);
      return response.data.data;
    },
    enabled: !!actualQuizId
  });

  return quizQuestionsQuery;
};

export const useQuizQuestionsByAi = () => {
  const { id: noteId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['quizzes'],
    mutationFn: async (quizId: string) => {
      const response = await QuizApi.bulkCreateQuestionsByAi(noteId, quizId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes']
      });
      toast.success('Quiz created successfully');
    }
  });
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
      toast.success('Quiz created successfully');
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
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['quiz-questions', data._id]
      });
    }
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['quizzes'],
    mutationFn: async (data: { _id: string; data: QuizCreateDto }) => {
      const response = await QuizApi.update(data._id, data.data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes']
      });
    }
  });
};

export const useUpdateQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['quizzes'],
    mutationFn: async (data: { quizId: string; questions: QuizQuestion[] }) => {
      const response = await QuizApi.bulkUpdateQuestions(
        data.quizId,
        data.questions
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes']
      });
    }
  });
};

export const useDeleteQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { quizId: string; questions: string[] }) => {
      return QuizApi.bulkDeleteQuestions(data.quizId, data.questions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes']
      });
    }
  });
};
