import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { NoteClient } from '@/endpoints/AxiosClient';

// hooks/use-share.ts
export const useShareNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resourceId,
      usernameOrEmail
    }: {
      resourceId: string;
      usernameOrEmail: string;
    }) => {
      const response = await NoteClient.post(`/${resourceId}/share`, {
        usernameOrEmail
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getSharedUsers', variables.resourceId]
      });

      queryClient.invalidateQueries({
        queryKey: ['getNoteById', variables.resourceId]
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

export const useUnshareNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resourceId,
      usernameOrEmail
    }: {
      resourceId: string;
      usernameOrEmail: string;
    }) => {
      const response = await NoteClient.post(`/${resourceId}/unshare`, {
        usernameOrEmail
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getSharedUsers', variables.resourceId]
      });

      queryClient.invalidateQueries({
        queryKey: ['getNoteById', variables.resourceId]
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
