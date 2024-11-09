import { AxiosClient } from './AxiosClient';

export const DeckApi = {
  findByOwner: async function () {
    return AxiosClient.get('/decks');
  },

  createDeck: async function (data: { name: string; description: string }) {
    return AxiosClient.post('/decks', data);
  },
};

export const ResourceApi = {
  findByOwner: async function (type: 'decks' | 'quizzes') {
    return AxiosClient.get(`/${type}`);
  },
};
