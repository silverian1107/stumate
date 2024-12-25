import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { NoteClient } from '@/endpoints/AxiosClient';
import { DeckApi } from '@/endpoints/deck-api';

export const useShareNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      noteId,
      usernameOrEmail
    }: {
      noteId: string;
      usernameOrEmail: string;
    }) => {
      const response = await NoteClient.post(`/${noteId}/share`, {
        usernameOrEmail
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getSharedUsers', variables.noteId]
      });

      queryClient.invalidateQueries({
        queryKey: ['getNoteById', variables.noteId]
      });

      toast.success('Access granted');
    },
    onError: () => {
      toast.error('Failed to share note', {
        description: 'Unable to share with the specified user'
      });
    }
  });
};

export const useShareDeck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deckId,
      usernameOrEmail
    }: {
      deckId: string;
      usernameOrEmail: string;
    }) => {
      const response = await DeckApi.share(deckId, usernameOrEmail);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getSharedUsers', variables.deckId]
      });

      queryClient.invalidateQueries({
        queryKey: ['getDeckById', variables.deckId]
      });

      toast.success('Access granted');
    },
    onError: () => {
      toast.error('Failed to share deck', {
        description: 'Unable to share with the specified user'
      });
    }
  });
};

export const useUnshareNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      noteId,
      usernameOrEmail
    }: {
      noteId: string;
      usernameOrEmail: string;
    }) => {
      const response = await NoteClient.post(`/${noteId}/unshare`, {
        usernameOrEmail
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getSharedUsers', variables.noteId]
      });

      queryClient.invalidateQueries({
        queryKey: ['getNoteById', variables.noteId]
      });

      toast.success('Access revoked', {
        description: 'Successfully revoked access'
      });
    },
    onError: () => {
      toast.error('Failed to revoke access', {
        description: 'Unable to remove share permission'
      });
    }
  });
};

export const useUnshareDeck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deckId,
      usernameOrEmail
    }: {
      deckId: string;
      usernameOrEmail: string;
    }) => {
      const response = await DeckApi.unshare(deckId, usernameOrEmail);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getSharedUsers', variables.deckId]
      });

      queryClient.invalidateQueries({
        queryKey: ['getDeckById', variables.deckId]
      });

      toast.success('Access revoked', {
        description: 'Successfully revoked access'
      });
    },
    onError: () => {
      toast.error('Failed to revoke access', {
        description: 'Unable to remove share permission'
      });
    }
  });
};

export const useSharedUsers = (noteId: string) => {
  return useQuery({
    queryKey: ['getSharedUsers', noteId],
    queryFn: async () => {
      const response = await NoteClient.get(`/${noteId}/shared-resource`);
      return response.data;
    }
  });
};
