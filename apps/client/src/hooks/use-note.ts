'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { NoteApi } from '@/endpoints/note-api';
import type { CreateNoteProps } from '@/types/collection';
import type { NoteUpdateDto } from '@/types/note';

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: CreateNoteProps) => {
      const response = await NoteApi.create(note);
      return response.data;
    },
    onSuccess: (data) => {
      toast('Collection Created', {
        description: 'success'
      });

      queryClient.invalidateQueries({
        queryKey: ['getDocuments', data.data.parentId]
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  });
};

export const useNoteById = () => {
  const { id } = useParams();
  const noteId = id as string;
  return useQuery({
    queryKey: ['getNoteById', noteId],
    queryFn: async () => {
      return NoteApi.findById(noteId)
        .then((res) => res.data)
        .catch();
    }
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ _id, name, body, attachment }: NoteUpdateDto) => {
      const response = await NoteApi.updateById(_id, {
        name,
        body,
        attachment
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getNoteById', data._id]
      });
    },
    onError: () => {
      toast.error('Failed to update note', {
        description: 'From useUpdateNote'
      });
    }
  });
};
