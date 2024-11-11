import { DeckClient } from './AxiosClient';

interface DeckCreateDTO {
  name: string;
  description?: string;
}

export const DeckApi = {
  findByOwner: async function () {
    return DeckClient.get('');
  },

  findById: async function (id: string) {
    return DeckClient.get(`/${id}`);
  },

  create: async function (data: DeckCreateDTO) {
    return (await DeckClient.post('', data)).data;
  },

  update: async function (
    deckId: string,
    data: { name?: string; description?: string },
  ) {
    return (await DeckClient.patch(`${deckId}`, data)).data;
  },
};
