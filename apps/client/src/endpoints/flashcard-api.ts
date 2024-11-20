import { FlashcardElement } from '@/types/deck';

import { AxiosClient, DeckClient } from './AxiosClient';

export const FlashcardApi = {
  findByOwner: async function () {
    return AxiosClient.get('/flashcards');
  },

  createDeck: async function (data: { name: string; description: string }) {
    return AxiosClient.post('/flashcards', data);
  },

  bulkCreate: async function (deckId: string, flashcards: FlashcardElement[]) {
    return DeckClient.post(`/${deckId}/flashcards/bulk/create`, flashcards);
  },
  bulkUpdate: async function (deckId: string, flashcards: FlashcardElement[]) {
    return DeckClient.post(`/${deckId}/flashcards/bulk/update`, flashcards);
  },

  findAllInDeck: async function (deckId: string) {
    return DeckClient.get(`/${deckId}/flashcards/all`);
  },
};
