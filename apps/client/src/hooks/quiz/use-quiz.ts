'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { QuizApi } from '@/endpoints/quiz/quiz-api';
import type { QuizCreateDto, QuizQuestion } from '@/endpoints/quiz/type';
import type { Quiz } from '@/types/deck';
import type { PaginatedResult, WithId } from '@/types/pagination';

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

export const useQuizzesByOwnerWithPagination = (
  currentPage = 1,
  pageSize = 10
) => {
  return useQuery({
    queryKey: ['quizzes', currentPage, pageSize],
    queryFn: async (): Promise<PaginatedResult<Quiz & WithId>> => {
      const response = await QuizApi.findByUserWithPagination(
        currentPage,
        pageSize
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5
  });
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
    queryKey: ['quiz-questions', actualQuizId],
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
    mutationKey: ['quiz-questions'],
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
    mutationKey: ['quiz-questions'],
    mutationFn: async (data: { quizId: string; questions: QuizQuestion[] }) => {
      const response = await QuizApi.bulkUpdateQuestions(
        data.quizId,
        data.questions
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quiz-questions']
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
        queryKey: ['quiz-questions']
      });
    }
  });
};

export const useArchiveQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['archive-quiz'],
    mutationFn: async (data: { quizId: string }) => {
      const response = await QuizApi.archive(data.quizId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['quizz'],
        exact: false
      });
    }
  });
};

export const useRestoreQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['restore-quiz'],
    mutationFn: async (data: { quizId: string }) => {
      const response = await QuizApi.restore(data.quizId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['quizz'],
        exact: false
      });
    }
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-quiz'],
    mutationFn: async (data: { quizId: string }) => {
      const response = await QuizApi.delete(data.quizId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['quizz'],
        exact: false
      });
    }
  });
};
