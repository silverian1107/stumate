import type { FlashcardElement } from '@/types/deck';

import { AxiosClient, DeckClient } from './AxiosClient';

export const FlashcardApi = {
  async findByOwner() {
    return AxiosClient.get('/flashcards');
  },

  async createDeck(data: { name: string; description: string }) {
    return AxiosClient.post('/flashcards', data);
  },

  async bulkCreate(deckId: string, flashcards: FlashcardElement[]) {
    return DeckClient.post(`/${deckId}/flashcards/bulk/create`, flashcards);
  },

  async bulkUpdate(deckId: string, flashcards: FlashcardElement[]) {
    return DeckClient.post(`/${deckId}/flashcards/bulk/update`, flashcards);
  },

  async bulkDelete(deckId: string, flashcardIds: string[]) {
    return DeckClient.delete(`/${deckId}/flashcards/bulk/delete`, {
      data: JSON.stringify(flashcardIds)
    });
  },

  async findAllInDeck(deckId: string) {
    return DeckClient.get(`/${deckId}/flashcards/all`);
  }
};
