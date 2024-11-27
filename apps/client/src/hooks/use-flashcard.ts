import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { FlashcardApi } from '@/endpoints/flashcard-api';

export const useRemoveFLashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, _id }: { deckId: string; _id: string }) =>
      FlashcardApi.remove(deckId, _id),
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
