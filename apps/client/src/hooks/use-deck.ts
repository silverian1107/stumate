'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { DeckApi } from '@/endpoints/deck-api';
import { FlashcardApi } from '@/endpoints/flashcard-api';
import { setFlashcards } from '@/redux/slices/resourceSlice';

import type {
  Deck,
  FlashcardElement,
  FlashcardElementWithAction
} from '../types/deck';

export function useDeckManager() {
  const params = useParams();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const deckId = params.id as string | undefined;
  const isEditing = Boolean(deckId);

  const deckQuery = useQuery({
    queryKey: ['decks', deckId],
    queryFn: async (): Promise<Deck> => {
      if (!isEditing || !deckId) {
        return {
          name: '',
          description: '',
          flashcards: []
        };
      }

      const deckData = (await DeckApi.findById(deckId)).data;
      const flashcardData = (await FlashcardApi.findAllInDeck(deckId)).data;
      const deck = deckData.data;
      const flashcards = flashcardData.data;

      // Map the FlashcardElement to FlashcardElementWithAction
      const flashcardsWithAction: FlashcardElementWithAction[] = flashcards.map(
        (card: FlashcardElementWithAction) => ({
          ...card,
          action: 'update',
          originalAction: 'update',
          isDeleted: false
        })
      );

      dispatch(setFlashcards(flashcardsWithAction));

      return {
        _id: deckId[0],
        name: deck.name,
        description: deck.description,
        flashcards
      };
    }
  });

  const deckCreateMutatation = useMutation({
    mutationFn: async (deck: Deck) => {
      const { name, description } = deck;
      return DeckApi.create({ name, description });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['decks', data.data.id] });
      return data.data.id;
    }
  });

  const deckUpdateMutatation = useMutation({
    mutationFn: async (data: { deckId: string; deck: Deck }) => {
      const { name, description } = data.deck;
      return DeckApi.update(data.deckId, { name, description });
    },
    onSuccess: (data) => {
      toast('Deck Updated', {
        description: 'Deck has been updated successfully.'
      });
      queryClient.invalidateQueries({ queryKey: ['decks', data.data.id] });
      return data.data.id;
    }
  });

  const cardBulkCreate = useMutation({
    mutationFn: async (data: { deckId: string; cards: FlashcardElement[] }) => {
      return FlashcardApi.bulkCreate(data.deckId, data.cards);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['decks', data.data.id]
      });
      return data.data.id;
    }
  });

  const cardBulkUpdate = useMutation({
    mutationFn: async (data: { deckId: string; cards: FlashcardElement[] }) => {
      return FlashcardApi.bulkUpdate(data.deckId, data.cards);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['decks', data.data.id]
      });
      return data.data.id;
    }
  });

  const cardBulkDelete = useMutation({
    mutationFn: async (data: { deckId: string; cards: string[] }) => {
      return FlashcardApi.bulkDelete(data.deckId, data.cards);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['decks', data.data.id]
      });
      return data.data.id;
    }
  });

  const saveResource = async (deck: Deck) => {
    const id = deck._id;

    try {
      if (id) {
        const updatedCard = deck.flashcards
          .filter((card) => card.action === 'update')
          .map((card) => ({
            _id: card._id,
            front: card.front,
            back: card.back
          }));

        const createdCard = deck.flashcards
          .filter((card) => card.action === 'create')
          .map((card) => ({ ...card, _id: undefined }));

        const deletedCard = deck.flashcards
          .filter((card) => card.action === 'delete')
          .map((card) => card._id)
          .filter((idx) => idx !== undefined) as string[];

        const promises = [];

        if (updatedCard.length > 0) {
          promises.push(
            cardBulkUpdate.mutateAsync({
              deckId: id,
              cards: updatedCard
            })
          );
        }

        if (createdCard.length > 0) {
          promises.push(
            cardBulkCreate.mutateAsync({
              deckId: id,
              cards: createdCard
            })
          );
        }

        if (deletedCard.length > 0) {
          promises.push(
            cardBulkDelete.mutateAsync({
              deckId: id,
              cards: deletedCard
            })
          );
        }

        await Promise.all(promises);

        return await deckUpdateMutatation.mutateAsync({ deckId: id, deck });
      }

      const savedDeck = await deckCreateMutatation.mutateAsync(deck);
      await cardBulkCreate.mutateAsync({
        deckId: savedDeck.data._id,
        cards: deck.flashcards
      });

      return savedDeck.id;
    } catch (error) {
      toast.error('Failed to save deck', {
        description: 'Please try again.'
      });

      return undefined;
    }
  };

  return {
    isEditing,
    deck: deckQuery.data,
    isLoading: deckQuery.isLoading,
    saveResource,
    isSubmitting: deckCreateMutatation.isPending
  };
}
