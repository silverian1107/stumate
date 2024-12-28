import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { FlashcardsApi } from '@/endpoints/flashcard-api';

export const useStudyFlashcards = (deckId: string) => {
  return useQuery({
    queryKey: ['studyFlashcards', deckId],
    queryFn: async () => {
      const response = await FlashcardsApi.fetchStudyFlashcards(deckId);
      return response.data.flashcards;
    }
  });
};

export const useMarkFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, rating }: { id: string; rating: number }) =>
      FlashcardsApi.markFlashcard(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flashcards']
      });
      queryClient.invalidateQueries({
        queryKey: ['decks'],
        exact: false
      });
      queryClient.invalidateQueries({ queryKey: ['deck'], exact: false });
      queryClient.invalidateQueries({
        queryKey: ['flashcardsByDeckId'],
        exact: false
      });
    }
  });
};

export const useRemoveFLashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, _id }: { deckId: string; _id: string }) =>
      FlashcardsApi.remove(deckId, _id),
    onSuccess: (_, variables) => {
      const { deckId } = variables;
      toast('Flashcard Deleted', {
        description: 'Flashcard has been deleted.'
      });
      queryClient.invalidateQueries({
        queryKey: ['flashcards', deckId]
      });
    }
  });
};
