import { QuizClient } from './AxiosClient';

export interface QuizCreateDto {
  name: string;
  description?: string;
  numberOfQuestion: number;
  duration: number;
}

export interface QuizAnswer {
  option: string;
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

  async create(data: QuizCreateDto) {
    return (await QuizClient.post('', data)).data;
  },

  async update(deckId: string, data: { name?: string; description?: string }) {
    return (await QuizClient.patch(`${deckId}`, data)).data;
  },

  async bulkCreateQuestions(quizId: string, questions: QuizQuestion[]) {
    return (await QuizClient.post(`/${quizId}/quiz-questions/bulk`, questions))
      .data;
  }
};
