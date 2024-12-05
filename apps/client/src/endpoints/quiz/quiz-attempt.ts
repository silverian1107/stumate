import { AxiosClient, QuizClient } from '../AxiosClient';

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
  }
};
