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
    setFlashcardErrors(
      state,
      action: PayloadAction<{
        index: number;
        frontError: boolean;
        backError: boolean;
      }>
    ) {
      const { index, frontError, backError } = action.payload;
      const card = state.flashcards[index];
      if (card) {
        card.frontError = frontError;
        card.backError = backError;
      }
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
        isDeleted: false,
        frontError: false,
        backError: false
      });
    },

    clearFlashcards(state) {
      state.flashcards.forEach((flashcard) => {
        flashcard.isDeleted = true;
        flashcard.action = 'delete';
      });
    },

    restoreAllCards(state) {
      state.flashcards.forEach((flashcard) => {
        flashcard.isDeleted = false;
        flashcard.action = flashcard.originalAction || 'update';
      });
    },

    restoreFlashcard(state, action: PayloadAction<number>) {
      const card = state.flashcards[action.payload];
      card.isDeleted = false;
      card.action = card.originalAction || 'update';
    },

    removeFlashcard(state, action: PayloadAction<number>) {
      const card = state.flashcards[action.payload];
      card.isDeleted = true;
      card.action = 'delete';
    },

    permanentlyDeleteCards(state) {
      state.flashcards = state.flashcards.filter((card) => !card.isDeleted);
    },

    permanentlyDeleteACard(state, action: PayloadAction<number>) {
      state.flashcards = state.flashcards.filter(
        (_, index) => index !== action.payload
      );
    }
  }
});

export const {
  setFlashcards,
  updateFlashcards,
  addFlashcard,
  removeFlashcard,
  restoreFlashcard,
  restoreAllCards,
  clearFlashcards,
  permanentlyDeleteCards,
  permanentlyDeleteACard,
  setFlashcardErrors
} = resourceSlice.actions;

export default resourceSlice.reducer;
