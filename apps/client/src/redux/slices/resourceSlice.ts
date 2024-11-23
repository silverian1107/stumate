import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { FlashcardElementWithAction } from '@/types/deck';

interface ResourceState {
  flashcards: FlashcardElementWithAction[];
}

const initialState: ResourceState = {
  flashcards: []
};

const resourceSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setFlashcards(state, action: PayloadAction<FlashcardElementWithAction[]>) {
      state.flashcards = action.payload;
    },

    updateFlashcards(
      state,
      action: PayloadAction<{
        index: number;
        fieldName: string;
        value: string;
      }>
    ) {
      const { index, fieldName, value } = action.payload;
      const card = state.flashcards[index];

      (card as unknown as Record<string, string>)[fieldName] = value;

      if (!card.isDeleted) {
        card.action = card.originalAction || 'update';
      }
    },

    addFlashcard(state) {
      state.flashcards.push({
        _id: Date.now().toString(),
        front: '',
        back: '',
        action: 'create',
        originalAction: 'create',
        isDeleted: false
      });
    },

    clearFlashcards(state) {
      state.flashcards.forEach((flashcard) => {
        flashcard.isDeleted = true;
        flashcard.action = 'delete';
      });
    },

    removeAllCards(state) {
      state.flashcards.forEach((flashcard) => {
        flashcard.isDeleted = false;
        flashcard.action = flashcard.originalAction || 'update';
      });
    },

    removeFlashcard(state, action: PayloadAction<number>) {
      const card = state.flashcards[action.payload];
      card.isDeleted = true;
      card.action = 'delete';
    },

    restoreFlashcard(state, action: PayloadAction<number>) {
      const card = state.flashcards[action.payload];
      card.isDeleted = false;
      card.action = card.originalAction || 'update';
    },

    permanentlyDeleteCards(state) {
      state.flashcards = state.flashcards.filter((card) => !card.isDeleted);
    }
  }
});

export const {
  setFlashcards,
  updateFlashcards,
  addFlashcard,
  removeFlashcard,
  restoreFlashcard,
  removeAllCards,
  clearFlashcards,
  permanentlyDeleteCards
} = resourceSlice.actions;

export default resourceSlice.reducer;
