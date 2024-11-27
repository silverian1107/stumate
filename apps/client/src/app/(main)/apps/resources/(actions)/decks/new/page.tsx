'use client';

import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { useDeckManager } from '@/hooks/use-deck';
import { setFlashcards } from '@/redux/slices/resourceSlice';
import type { RootState } from '@/redux/store';
import type { Deck } from '@/types/deck';

import { ResourceElements } from '../../_components/creator';
import { DeckActionHeader } from '../../_components/header';

export default function ResourcePage() {
  const dispatch = useDispatch();
  const resource = useSelector((state: RootState) => state.decks);

  const {
    isEditing,
    deck: initialResource,
    saveResource,
    isSubmitting,
    isLoading
  } = useDeckManager();

  useEffect(() => {
    if (initialResource && initialResource.flashcards) {
      dispatch(setFlashcards(initialResource.flashcards));
    }
  }, [initialResource, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (formData: {
    name: string;
    description?: string;
  }) => {
    try {
      const invalidFlashcards = resource.flashcards.filter(
        (fc) => !fc.front.trim() || !fc.back.trim()
      );
      console.log(invalidFlashcards);

      if (invalidFlashcards.length > 0) {
        return; // Prevent submission
      }

      const resourceToSubmit: Deck = {
        ...initialResource,
        flashcards: resource.flashcards,
        name: formData.name,
        description: formData.description
      } as Deck;

      await saveResource(resourceToSubmit);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error('Error submitting resource', {
          description: error.message
        });
      }
    }
  };

  return (
    <>
      <DeckActionHeader
        initialData={initialResource}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <ResourceElements />
    </>
  );
}
