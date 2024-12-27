'use client';

import { AxiosError } from 'axios';
import { ArchiveIcon, Share2Icon, Undo2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import StatusBar from '@/components/status-bar';
import {
  useArchiveDeck,
  useDeckById,
  useDeckManager,
  useDeleteDeck,
  useRestoreDeck
} from '@/hooks/use-deck';
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
  const { id } = useParams();
  const { data: deck } = useDeckById(id as string);

  const dispatch = useDispatch();
  const resource = useSelector((state: RootState) => state.decks);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const archiveDeck = useArchiveDeck();
  const restoreDeck = useRestoreDeck();
  const deleteDeck = useDeleteDeck();

  const { isEditing, saveResource, isSubmitting, isLoading } = useDeckManager();

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
    toast.success('Deck archived successfully!');
  };

  const handleRestoreDeck = async () => {
    await restoreDeck.mutateAsync(deck?._id || '');
    toast.success('Deck restored successfully!');
  };

  const handleDeleteDeck = async () => {
    await deleteDeck.mutateAsync(deck?._id || '');
    toast.success('Deck deleted successfully!');
  };

  return (
    <>
      <StatusBar
        type="Deck"
        data={deck}
        isLoading={isLoading}
        handleRestore={handleRestoreDeck}
        handleDelete={handleDeleteDeck}
      />
      <div className="mx-auto flex size-full flex-col space-y-6 px-4 py-8 lg:w-4/5 lg:text-base xl:w-3/5">
        <div className="w-full flex justify-start">
          {!deck.isArchived && (
            <button
              type="button"
              onClick={handleArchiveDeck}
              className="border-primary-500 text-primary-500 border text-sm rounded-md px-2 py-1 flex items-center gap-2 hover:bg-primary-100/80"
            >
              <ArchiveIcon className="size-4" />
              Archive
            </button>
          )}
          {deck.isArchived && (
            <button
              type="button"
              onClick={handleRestoreDeck}
              className="border-primary-500 text-primary-500 border text-sm rounded-md px-2 py-1 flex items-center gap-2 hover:bg-primary-100/80"
            >
              <Undo2Icon className="size-4" />
              Restore
            </button>
          )}
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
      </div>
    </>
  );
}
