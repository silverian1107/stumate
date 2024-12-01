import { DeckClient } from './AxiosClient';

interface DeckCreateDTO {
  name: string;
  description?: string;
}

export const DeckApi = {
  async findByOwner() {
    return DeckClient.get('/all');
  },

  async findById(id: string) {
    return DeckClient.get(`/${id}`);
  },

  async create(data: DeckCreateDTO) {
    return (await DeckClient.post('', data)).data;
  },

  async update(deckId: string, data: { name?: string; description?: string }) {
    return (await DeckClient.patch(`${deckId}`, data)).data;
  }
};
