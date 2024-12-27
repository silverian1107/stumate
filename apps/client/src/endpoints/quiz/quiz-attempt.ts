import { AxiosClient, QuizClient } from '../AxiosClient';

export interface CustomAttempt {
  selectedQuizzes: string[];
  duration: number;
  numberOfQuestions: number;
}

export const QuizAttemptApi = {
  async getAttemptData(attemptId: string) {
    return (await AxiosClient.get(`/quiz-attempts/${attemptId}/data`)).data;
  },
  async startQuizAttempt(quizTestId: string) {
    return (await QuizClient.post(`/${quizTestId}/quiz-attempts/start`)).data;
  },
  async submitQuizAttempt(
    quizTestId: string,
    attemptId: string,
    answers: unknown
  ) {
    return (
      await QuizClient.post(
        `/${quizTestId}/quiz-attempts/${attemptId}/submit`,
        {
          answers
        }
      )
    ).data;
  },

  async createCustomAttempt(customAttempt: CustomAttempt) {
    return AxiosClient.post('quiz-attempts/custom', customAttempt);
  }
};
