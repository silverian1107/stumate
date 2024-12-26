'use client';

import { AxiosError } from 'axios';
import { ArchiveIcon, Share2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { useArchiveDeck, useDeckManager } from '@/hooks/use-deck';
import {
  setFlashcardErrors,
  setFlashcards
} from '@/redux/slices/resourceSlice';
import type { RootState } from '@/redux/store';
import type { Deck } from '@/types/deck';

import { ResourceElements } from '../../../_components/creator';
import { DeckActionHeader } from '../../../_components/header';
import ShareDeckDialog from './share-deck-dialog';

export default function DeckPage() {
  const dispatch = useDispatch();
  const resource = useSelector((state: RootState) => state.decks);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const archiveDeck = useArchiveDeck();

  const { isEditing, deck, saveResource, isSubmitting, isLoading } =
    useDeckManager();

  useEffect(() => {
    if (deck && deck.flashcards) {
      dispatch(setFlashcards(deck.flashcards));
    }
  }, [deck, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (formData: {
    name: string;
    description?: string;
  }) => {
    try {
      let hasErrors = false;

      resource.flashcards.forEach((fc, index) => {
        const frontError = !fc.front.trim();
        const backError = !fc.back.trim();
        if (frontError || backError) {
          hasErrors = true;
        }
        dispatch(setFlashcardErrors({ index, frontError, backError }));
      });

      if (hasErrors) {
        return;
      }

      const resourceToSubmit: Deck = {
        ...deck,
        flashcards: resource.flashcards,
        name: formData.name,
        description: formData.description
      } as Deck;

      await saveResource(resourceToSubmit);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error('Error submitting resource', {
          description: 'Error'
        });
      }
    }
  };

  const handleArchiveDeck = async () => {
    await archiveDeck.mutateAsync(deck?._id || '');
    toast.success('Deck archived successfully!'); // Không cần quan tâm thằng này
  };

  return (
    <>
      <div className="w-full flex justify-start">
        <button
          type="button"
          onClick={handleArchiveDeck}
          className="border-primary-500 text-primary-500 border text-sm rounded-md px-2 py-1 flex items-center gap-2 hover:bg-primary-100/80"
        >
          <ArchiveIcon className="size-4" />
          Archive
        </button>
        <button
          type="button"
          className="border-primary-500 text-primary-500 border text-sm rounded-md px-2 py-1 flex items-center gap-2 hover:bg-primary-100/80 ml-auto"
          onClick={() => setIsShareDialogOpen(true)}
        >
          <Share2Icon className="size-4" />
          Share Deck
        </button>
      </div>

      <DeckActionHeader
        initialData={deck}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <ResourceElements />

      <ShareDeckDialog
        deckId={deck?._id || ''}
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      />
    </>
  );
}
