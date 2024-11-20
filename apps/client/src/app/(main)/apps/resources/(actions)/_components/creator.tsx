'use client';

import { useSelector } from 'react-redux';

import {
  addFlashcard,
  clearFlashcards,
  removeAllCards
} from '@/redux/slices/resourceSlice';
import type { RootState } from '@/redux/store';

import FlashcardField from './flashcard-field';
import ResourceActionButton from './resource-action-button';

export function ResourceElements() {
  const deck = useSelector((state: RootState) => state.decks);
  const flashcards = deck.flashcards || [];

  if (!flashcards) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 w-full flex flex-col flex-1 overflow-auto relative">
      <h3>Total Cards ({flashcards.length})</h3>
      <div className="flex flex-col overflow-auto gap-3">
        {flashcards.map((element, index) => (
          <FlashcardField element={element} index={index} key={element._id} />
        ))}
      </div>
      <ResourceActionButton
        resouces={flashcards}
        addNewAction={addFlashcard}
        clearAction={clearFlashcards}
        removeAction={removeAllCards}
      />
    </div>
  );
}
