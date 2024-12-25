import { DeckClient } from './AxiosClient';

interface DeckCreateDTO {
  name: string;
  description?: string;
}

export const DeckApi = {
  async create(data: DeckCreateDTO) {
    return (await DeckClient.post('', data)).data;
  },

  async findByOwner() {
    return DeckClient.get('/all');
  },

  async findById(id: string) {
    return DeckClient.get(`/${id}`);
  },

  async findByNoteId(noteId: string) {
    const response = await DeckClient.get(`/by-note/${noteId}`);
    return response.data.data;
  },

  async update(deckId: string, data: { name?: string; description?: string }) {
    return (await DeckClient.patch(`${deckId}`, data)).data;
  },

  async archive(deckId: string) {
    return DeckClient.post(`${deckId}/archive`);
  },

  async share(deckId: string, usernameOrEmail: string) {
    return (await DeckClient.post(`${deckId}/share`, { usernameOrEmail })).data;
  },

  async unshare(deckId: string, usernameOrEmail: string) {
    return (await DeckClient.post(`${deckId}/unshare`, { usernameOrEmail }))
      .data;
  }
};
