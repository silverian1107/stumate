'use client';

import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { useCardBulkCreate, useCreateDeck } from '@/hooks/use-deck';
import { setFlashcards } from '@/redux/slices/resourceSlice';
import type { RootState } from '@/redux/store';
import type { DeckCreateDto } from '@/types/deck';

import { ResourceElements } from '../../_components/creator';
import { DeckActionHeader } from '../../_components/header';

export default function ResourcePage() {
  const dispatch = useDispatch();
  const resource = useSelector((state: RootState) => state.decks);
  const router = useRouter();

  const createDeck = useCreateDeck();
  const bulkCreateFlashcards = useCardBulkCreate();

  useEffect(() => {
    dispatch(setFlashcards([]));
  }, [dispatch]);

  const handleSubmit = async (formData: DeckCreateDto) => {
    try {
      const invalidFlashcards = resource.flashcards.filter(
        (fc) => !fc.front.trim() || !fc.back.trim()
      );

      if (invalidFlashcards.length > 0) {
        return;
      }

      const newDeck = await createDeck.mutateAsync(formData);

      await bulkCreateFlashcards.mutateAsync({
        deckId: newDeck._id,
        cards: resource.flashcards
      });

      toast.success('Resource created successfully');
      router.replace('/apps/resources/decks/view');
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
      <DeckActionHeader onSubmit={handleSubmit} />
      <ResourceElements />
    </>
  );
}
