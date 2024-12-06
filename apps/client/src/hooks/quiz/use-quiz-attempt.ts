import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { QuizAttemptApi } from '@/endpoints/quiz/quiz-attempt';

export const useQuizAttemptData = () => {
  const { id } = useParams<{ id: string }>();
  const queryResult = useQuery({
    queryKey: ['quiz-attempt', id],
    queryFn: async () => {
      const response = await QuizAttemptApi.getAttemptData(id);
      return response.data;
    },
    enabled: !!id
  });
  return queryResult;
};

export const useStartQuizAttempt = (id?: string) => {
  const { id: quizTestIdFromParams } = useParams<{ id: string }>();
  const quizTestId = id || quizTestIdFromParams;

  return useMutation({
    mutationFn: async () => {
      return (await QuizAttemptApi.startQuizAttempt(quizTestId)).data;
    }
  });
};

export const useSubmitQuizAttempt = () => {
  const { id: attemptId } = useParams<{ id: string }>();
  return useMutation({
    mutationFn: async ({
      quizTestId,
      answers
    }: {
      quizTestId: string;
      answers: unknown;
    }) => {
      return (
        await QuizAttemptApi.submitQuizAttempt(quizTestId, attemptId, answers)
      ).data;
    }
  });
};
