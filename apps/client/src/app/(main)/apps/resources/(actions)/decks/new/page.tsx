'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useDeckManager } from '@/hooks/use-deck';
import { setFlashcards } from '@/redux/slices/resourceSlice';
import { RootState } from '@/redux/store';
import { Deck } from '@/types/deck';

import { ResourceElements } from '../../_components/creator';
import { ResourceHeader } from '../../_components/header';

export default function ResourcePage() {
  const dispatch = useDispatch();
  const resource = useSelector((state: RootState) => state.decks);

  const {
    isEditing,
    deck: initialResource,
    saveResource,
    isSubmitting,
    isLoading,
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
      const resourceToSubmit: Deck = {
        ...initialResource,
        flashcards: resource.flashcards,
        name: formData.name,
        description: formData.description,
      } as Deck;

      await saveResource(resourceToSubmit);
    } catch (error) {
      console.error('Error submitting resource:', error);
    }
  };

  return (
    <>
      <ResourceHeader
        initialData={initialResource}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <ResourceElements />
    </>
  );
}
