'use client';

import { CollectionApi } from '@/endpoints/collection-api';
import { NoteApi } from '@/endpoints/note-api';
import {
  Collection,
  CreateCollectionProps,
  DocumentListProps,
  Note,
} from '@/types/collection';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useCollection = (collectionById: string) => {
  return useQuery({
    queryKey: ['getNoteById', collectionById],
    queryFn: async () => {
      return CollectionApi.findById(collectionById)
        .then((res) => res.data.data)
        .catch();
    },
  });
};

// export const useUpdateNote = () => {
//   return useMutation({
//     mutationFn: async ({ _id, name, body, attachment }: NoteUpdateDto) => {
//       return NoteApi.updateById(_id, { name, body, attachment });
//     },
//     onError: (error) => console.log(error),
//   });
// };

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collection: CreateCollectionProps) => {
      return CollectionApi.create(collection);
    },
    onSuccess: (data) => {
      console.log('On sucess data', data);

      toast('Collection Created', {
        description: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['getDocuments', data.data.parentId, 'Collection'],
      });
    },
    onError: (error) => console.log(error),
  });
};

export const useDocuments = ({
  parentDocumentId,
  level = 0,
  type = 'Collection',
}: DocumentListProps) => {
  return useQuery<Collection[] | Note[], AxiosError>({
    queryKey: ['getDocuments', parentDocumentId, type],
    queryFn: async () => {
      if (!parentDocumentId && type === 'Collection') {
        const response = await CollectionApi.findByOwner({
          currentPage: 1,
          pageSize: 10,
          qs: '',
        });

        return response.data.data.result;
      } else if (parentDocumentId && type === 'Collection') {
        const response = await CollectionApi.findById(parentDocumentId);
        return response.data.data.childrenDocs || [];
      } else if (parentDocumentId && type === 'Note') {
        const response = await NoteApi.findById(parentDocumentId);
        return response.data.data.childrenDocs || [];
      }
      return [];
    },
    enabled: !!parentDocumentId || level === 0,
  });
};
