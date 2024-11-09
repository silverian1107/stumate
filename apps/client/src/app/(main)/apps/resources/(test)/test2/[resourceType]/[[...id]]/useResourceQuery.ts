// hooks/useResourceManager.ts
'use client';

import { DeckApi } from '@/endpoints/deck-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ResourceElement, ResourceType } from './type';

const validResourceTypes: ResourceType[] = ['quizzes', 'decks', 'assessment'];
export function useResourceManager() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const resourceType = params.resourceType as ResourceType;
  useEffect(() => {
    if (!validResourceTypes.includes(resourceType)) {
      router.replace('/404');
    }
  }, [resourceType, router]);

  console.log(resourceType);

  const resourceId = params.id as string | undefined;
  const isEditing = Boolean(resourceId);

  // Simulating a server request with console.log
  const { data: resource, isLoading } = useQuery({
    queryKey: ['resource', resourceType, resourceId],
    queryFn: async () => {
      if (!isEditing) return { name: '', description: '', elements: [] };
      console.log(
        `Fetching resource for ${resourceType} with ID: ${resourceId}`,
      );
      return {
        name: 'Sample Resource',
        description: 'This is a sample description',
        elements: [
          {
            id: '1',
            front: 'Sample front content',
            back: 'Sample back content',
          },
        ],
      };
    },
  });

  // Simulating a mutation with console.log
  const resourceMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      elements: ResourceElement[];
    }) => {
      const { name, description } = data;
      const response = await DeckApi.createDeck({ name, description });
      // console.log(response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource', resourceType] });
    },
  });

  return {
    resourceType,
    isEditing,
    resource,
    isLoading,
    saveResource: resourceMutation.mutateAsync,
    isSubmitting: resourceMutation.isPending,
  };
}
