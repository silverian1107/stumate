import { QuizClient } from '../AxiosClient';
import type { QuizCreateDto, QuizQuestion } from './type';

export const QuizApi = {
  async findByOwner() {
    return QuizClient.get('');
  },

  async findByUserWithPagination(page: number, size: number) {
    return QuizClient.get(`/with-pagination`, { params: { page, size } });
  },

  async findById(id: string) {
    return QuizClient.get(`/${id}`);
  },

  async findByQuizId(quizId: string) {
    return QuizClient.get(`/${quizId}/quiz-questions/all`);
  },

  async findByNoteId(noteId: string) {
    return QuizClient.get(`/by-note/${noteId}`);
  },

  async findArchived() {
    return QuizClient.get('/archived-resources/all');
  },

  async create(data: QuizCreateDto) {
    return (await QuizClient.post('', data)).data;
  },

  async update(deckId: string, data: { name?: string; description?: string }) {
    return (await QuizClient.patch(`${deckId}`, data)).data;
  },

  async bulkCreateQuestions(quizId: string, questions: QuizQuestion[]) {
    return QuizClient.post(`/${quizId}/quiz-questions/bulk`, questions);
  },

  async bulkCreateQuestionsByAi(noteId: string, quizId: string) {
    return QuizClient.post(`/${quizId}/quiz-questions/${noteId}/bulk/ai`);
  },

  async bulkUpdateQuestions(quizId: string, questions: QuizQuestion[]) {
    return QuizClient.patch(`/${quizId}/quiz-questions/bulk/update`, questions);
  },

  async bulkDeleteQuestions(quizId: string, questionIds: string[]) {
    return QuizClient.delete(`/${quizId}/quiz-questions/bulk/delete`, {
      data: questionIds
    });
  },

  async share(quizId: string, usernameOrEmail: string) {
    return (await QuizClient.post(`${quizId}/share`, { usernameOrEmail })).data;
  },

  async unshare(quizId: string, usernameOrEmail: string) {
    return (await QuizClient.post(`${quizId}/unshare`, { usernameOrEmail }))
      .data;
  },

  async archive(quizId: string) {
    return (await QuizClient.post(`${quizId}/archive`)).data;
  },

  async restore(quizId: string) {
    return (await QuizClient.post(`${quizId}/restore`)).data;
  },

  async delete(quizId: string) {
    return (await QuizClient.delete(`${quizId}`)).data;
  }
};
