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
    <div className="flex w-full flex-1 flex-col space-y-4 overflow-auto">
      <h3>Total Cards ({flashcards.length})</h3>
      <div className="flex flex-col gap-3 overflow-auto">
        {flashcards.map((element, index) => (
          <FlashcardField element={element} index={index} key={element._id} />
        ))}
      </div>
      <ResourceActionButton
        resouces={flashcards}
        removeAction={removeAllCards}
        addNewAction={addFlashcard}
        clearAction={clearFlashcards}
      />
    </div>
  );
}
