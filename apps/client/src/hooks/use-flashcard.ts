import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { FlashcardsApi } from '@/endpoints/flashcard-api';

export const useStudyFlashcards = (deckId?: string) => {
  const { id: routeDeckId } = useParams<{ id: string }>();
  const actualDeckId = deckId || routeDeckId;

  return useQuery({
    queryKey: ['study-flashcards', actualDeckId],
    queryFn: async () => {
      if (!actualDeckId) throw new Error('No deck ID provided');
      const response = await FlashcardsApi.fetchStudyFlashcards(actualDeckId);
      return response.data.flashcards;
    },
    enabled: !!actualDeckId
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
