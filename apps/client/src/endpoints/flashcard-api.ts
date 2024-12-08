import type { FlashcardElement } from '@/types/deck';

import { AxiosClient, DeckClient } from './AxiosClient';

export const FlashcardsApi = {
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
  },

  async remove(deckId: string, id: string) {
    return DeckClient.delete(`/${deckId}/flashcards/${id}`);
  },

  async fetchStudyFlashcards(deckId: string) {
    if (!deckId) throw new Error('No deck ID provided');
    const response = await DeckClient.get(`/${deckId}/flashcards/study`);
    return response.data;
  },

  async markFlashcard(id: string, rating: number) {
    const response = await DeckClient.post(`/api/flashcards/${id}/mark`, {
      rating
    });
    return response.data;
  }
};
