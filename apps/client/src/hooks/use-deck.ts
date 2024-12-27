'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { DeckApi } from '@/endpoints/deck-api';
import { FlashcardsApi } from '@/endpoints/flashcard-api';
import { setFlashcards } from '@/redux/slices/resourceSlice';

import type {
  Deck,
  DeckCreateDto,
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
      const flashcardData = (await FlashcardsApi.findAllInDeck(deckId)).data;
      const deck = deckData.data;
      const flashcards = flashcardData.data.result;

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
      queryClient.invalidateQueries({ queryKey: ['decks'] });

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
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      queryClient.invalidateQueries({ queryKey: ['decks', data.data.id] });
      queryClient.invalidateQueries({
        queryKey: ['flashcardsByDeckId', data.data.id]
      });
      return data.data.id;
    }
  });

  const cardBulkCreate = useMutation({
    mutationFn: async (data: { deckId: string; cards: FlashcardElement[] }) => {
      return FlashcardsApi.bulkCreate(data.deckId, data.cards);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['decks', data.data.id]
      });
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      queryClient.invalidateQueries({
        queryKey: ['flashcardsByDeckId', data.data.id]
      });
      return data.data.id;
    }
  });

  const cardBulkUpdate = useMutation({
    mutationFn: async (data: { deckId: string; cards: FlashcardElement[] }) => {
      return FlashcardsApi.bulkUpdate(data.deckId, data.cards);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['decks', data.data.id]
      });
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      queryClient.invalidateQueries({
        queryKey: ['flashcardsByDeckId', data.data.id]
      });

      return data.data.id;
    }
  });

  const cardBulkDelete = useMutation({
    mutationFn: async (data: { deckId: string; cards: string[] }) => {
      return FlashcardsApi.bulkDelete(data.deckId, data.cards);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['decks', data.data.id]
      });
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      queryClient.invalidateQueries({
        queryKey: ['flashcardsByDeckId', data.data.id]
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
    } catch {
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

interface NewDeckResponse {
  _id: string;
  createdAt: string;
}

export const useCreateDeck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deck: DeckCreateDto): Promise<NewDeckResponse> => {
      const response = await DeckApi.create(deck);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['decks', data._id] });
      queryClient.invalidateQueries({ queryKey: ['decks'] });
    }
  });
};

export const useDeckById = (deckId: string) => {
  return useQuery({
    queryKey: ['deck', deckId],
    queryFn: async () => {
      const response = await DeckApi.findById(deckId);
      return response.data.data;
    }
  });
};

export const useDeckByNoteId = (noteId: string) => {
  return useQuery({
    queryKey: ['decks', noteId],
    queryFn: async () => {
      if (!noteId) {
        throw new Error('noteId is required to fetch the deck.');
      }
      return DeckApi.findByNoteId(noteId);
    },
    enabled: !!noteId,
    retry: false
  });
};

export const useDeckByOwner = () => {
  return useQuery({
    queryKey: ['decks'],
    queryFn: async () => {
      const response = await DeckApi.findByOwner();
      return response.data.data;
    }
  });
};

export const useArchiveDeck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deckId: string) => {
      const response = await DeckApi.archive(deckId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['deck'], exact: false });
    }
  });
};

export const useGetArchivedDeck = () => {
  return useQuery({
    queryKey: ['getArchivedDeck'],
    queryFn: async () => {
      const response = await DeckApi.getArchivedDecks();
      return response.data.data;
    }
  });
};

export const useRestoreDeck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deckId: string) => {
      const response = await DeckApi.restore(deckId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['deck'], exact: false });
    }
  });
};

export const useDeleteDeck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deckId: string) => {
      const response = await DeckApi.delete(deckId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['deck'], exact: false });
    }
  });
};

export const useCardBulkCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { deckId: string; cards: FlashcardElement[] }) => {
      const { deckId, cards } = data;

      const filteredCards = cards.map(({ front, back }) => ({ front, back }));
      const response = await FlashcardsApi.bulkCreate(deckId, filteredCards);

      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['decks', data.data.id]
      });
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      queryClient.invalidateQueries({
        queryKey: ['flashcardsByDeckId', data.data.id]
      });

      return data.data.id;
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  });
};

export const useGenerateFlashcardsByAI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { deckId: string; noteId: string }) => {
      const { deckId, noteId } = data;
      const response = await FlashcardsApi.generateByAI(deckId, noteId);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['deck'],
        exact: false
      });
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      queryClient.invalidateQueries({
        queryKey: ['flashcardsByDeckId', data.id]
      });
    }
  });
};
