import { QuizClient } from './AxiosClient';

export interface QuizCreateDto {
  name: string;
  description?: string;
  numberOfQuestion: number;
  duration: number;
}

export interface QuizAnswer {
  _id?: string;
  option: string; // it mean text
  isCorrect: boolean;
}

export interface QuizQuestion {
  _id?: string;
  question: string;
  questionType: 'multiple' | 'single';
  answerOptions: QuizAnswer[];
}

export const QuizApi = {
  async findByOwner() {
    return QuizClient.get('');
  },

  async findById(id: string) {
    return QuizClient.get(`/${id}`);
  },

  async findByQuizId(quizId: string) {
    return QuizClient.get(`/${quizId}/quiz-questions/all`);
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

  async bulkUpdateQuestions(quizId: string, questions: QuizQuestion[]) {
    return QuizClient.patch(`/${quizId}/quiz-questions/bulk/update`, questions);
  },

  async bulkDeleteQuestions(quizId: string, questionIds: string[]) {
    return QuizClient.delete(`/${quizId}/quiz-questions/bulk/delete`, {
      data: questionIds
    });
  }
};
