import { QuizClient } from './AxiosClient';

interface DeckCreateDTO {
  name: string;
  description?: string;
}

export const QuizApi = {
  async findByOwner() {
    return QuizClient.get('');
  },

  async findById(id: string) {
    return QuizClient.get(`/${id}`);
  },

  async create(data: DeckCreateDTO) {
    return (await QuizClient.post('', data)).data;
  },

  async update(deckId: string, data: { name?: string; description?: string }) {
    return (await QuizClient.patch(`${deckId}`, data)).data;
  }
};
