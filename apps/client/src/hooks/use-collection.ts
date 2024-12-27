'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { CollectionApi } from '@/endpoints/collection-api';
import { NoteApi } from '@/endpoints/note-api';
import type {
  Collection,
  CreateCollectionProps,
  DocumentListProps,
  Note,
  UpdateCollectionParams
} from '@/types/collection';

type ChildDocSortField = {
  type: 'Collection' | 'Note';
  position: number;
};

export const useCollection = (collectionById: string) => {
  return useQuery({
    queryKey: ['getNoteById', collectionById],
    queryFn: async () => {
      return CollectionApi.findById(collectionById)
        .then((res) => res.data.data)
        .catch();
    }
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collection: CreateCollectionProps) => {
      return CollectionApi.create(collection);
    },
    onSuccess: (data) => {
      toast('Collection Created', {
        description: 'success'
      });

      queryClient.invalidateQueries({
        queryKey: ['getDocuments'],
        exact: false
      });
      if (data.data.parentId) {
        queryClient.invalidateQueries({
          queryKey: ['getDocuments', data.data.parentId]
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['getDocuments', null]
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  });
};
export const useDocuments = ({
  parentDocumentId,
  level = 0,
  type = 'Collection'
}: DocumentListProps) => {
  return useQuery<Collection[] | Note[], AxiosError>({
    queryKey: ['getDocuments', parentDocumentId],
    queryFn: async () => {
      if (!parentDocumentId && type === 'Collection') {
        const response = await CollectionApi.findByOwner({
          currentPage: 1,
          pageSize: 10,
          qs: ''
        });

        return response.data.result;
      }

      if (parentDocumentId && type === 'Collection') {
        const response = await CollectionApi.findById(parentDocumentId);
        const childrenDocs: ChildDocSortField[] =
          response.data.childrenDocs || [];

        childrenDocs.sort((a, b) => {
          if (a.type === 'Collection' && b.type !== 'Collection') return -1;
          if (a.type !== 'Collection' && b.type === 'Collection') return 1;
          return a.position - b.position;
        });

        return childrenDocs;
      }
      if (parentDocumentId && type === 'Note') {
        const response = await NoteApi.findById(parentDocumentId);
        return response.data.childrenDocs || [];
      }
      return [];
    },
    enabled: !!parentDocumentId || level === 0
  });
};

export const useGetArchivedCollection = () => {
  return useQuery({
    queryKey: ['getArchivedCollection'],
    queryFn: async () => {
      return CollectionApi.getArchivedByOwner();
    }
  });
};

export const useArchiveCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collectionId: string) => {
      const response = await CollectionApi.archive(collectionId);
      return response.data.data;
    },
    onSuccess: (_, collectionId) => {
      queryClient.invalidateQueries({
        queryKey: ['getDocuments'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['getNotes']
      });
      queryClient.invalidateQueries({
        queryKey: ['getArchivedCollection']
      });
      queryClient.invalidateQueries({
        queryKey: ['getArchivedResources']
      });
      queryClient.invalidateQueries({
        queryKey: ['getDocuments', collectionId]
      });
    },
    onError: () => {
      toast.error('Failed to archive the collection');
    }
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (collectionId: string) => {
      const response = await CollectionApi.delete(collectionId);
      return response.data.data;
    },
    onSuccess: (_, collectionId) => {
      queryClient.invalidateQueries({
        queryKey: ['getDocuments'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['getNotes']
      });
      queryClient.invalidateQueries({
        queryKey: ['getArchivedCollection']
      });
      queryClient.invalidateQueries({
        queryKey: ['getArchivedResources']
      });
      queryClient.invalidateQueries({
        queryKey: ['getDocuments', collectionId]
      });
    },
    onError: () => {
      toast.error('Failed to delete the collection');
    }
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ _id, name }: UpdateCollectionParams) => {
      const response = await CollectionApi.updateById(_id, {
        name
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getDocuments'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['getCollectionById', data._id]
      });
      if (data.parentId) {
        queryClient.invalidateQueries({
          queryKey: ['getDocuments', data.parentId]
        });
      }
    }
  });
};

export const useGetArchivedResources = () => {
  return useQuery({
    queryKey: ['getArchivedResources'],
    queryFn: async () => {
      const response = await CollectionApi.getArchivedResources();
      return response;
    },
    staleTime: 5 * 60 * 1000
  });
};

export const useRestoreCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const response = await CollectionApi.restore(noteId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getDocuments'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['getArchivedResources']
      });
      queryClient.invalidateQueries({
        queryKey: ['getArchivedCollection']
      });

      toast.success('Note Restored', {
        description: 'The note has been successfully restored'
      });
    },
    onError: () => {
      toast.error('Failed to restore the note');
    }
  });
};
