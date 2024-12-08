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
      toast('Note Created', {
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
        queryKey: ['getDocuments'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['getNoteById', data._id]
      });
      if (data.parentId) {
        queryClient.invalidateQueries({
          queryKey: ['getDocuments', data.parentId]
        });
      }

      toast.success('Note Updated', {
        description: 'Note has been successfully updated'
      });
    },
    onError: () => {
      toast.error('Failed to update note', {
        description: 'From useUpdateNote'
      });
    }
  });
};

export const useArchiveNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const response = await NoteApi.archive(noteId);
      return response.data.data;
    },
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({
        queryKey: ['getDocuments'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['getNotes']
      });
      queryClient.invalidateQueries({
        queryKey: ['getNoteById', noteId]
      });
      queryClient.invalidateQueries({
        queryKey: ['getArchivedNote']
      });

      toast.success('Note Archived', {
        description: 'The note has been successfully archived'
      });
    },
    onError: () => {
      toast.error('Failed to archive the note', {
        description: 'From useArchiveNote'
      });
    }
  });
};
