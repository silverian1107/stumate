import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import type { ResourceTypeEnum } from '@/endpoints/tag-api';
import { TagApi } from '@/endpoints/tag-api';

export const useTags = () => {
  return useQuery({
    queryKey: ['getTags'],
    queryFn: async () => {
      return TagApi.findByUser()
        .then((res) => res.data.data)
        .catch();
    }
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const response = await TagApi.create(name);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getTags']
      });
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.status === 409) {
          toast.error('Tag already exists');
        }
      }
    }
  });
};

export const useAssignTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resourceType,
      resourceId,
      tagId
    }: {
      resourceType: ResourceTypeEnum;
      resourceId: string;
      tagId: string;
    }) => {
      return TagApi.assign(resourceType, resourceId, tagId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getNoteById'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['getTags']
      });
    }
  });
};

export const useUnassignTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resourceType,
      resourceId,
      tagId
    }: {
      resourceType: ResourceTypeEnum;
      resourceId: string;
      tagId: string;
    }) => {
      return TagApi.unassign(resourceType, resourceId, tagId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getNoteById'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['getTags']
      });
    }
  });
};
