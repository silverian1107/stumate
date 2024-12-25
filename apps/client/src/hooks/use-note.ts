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
      queryClient.invalidateQueries({
        queryKey: ['search'],
        exact: false
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
        queryKey: ['getNoteById'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['search'],
        exact: false
      });
      if (data.parentId) {
        queryClient.invalidateQueries({
          queryKey: ['getDocuments', data.parentId]
        });
      }
    },
    onError: () => {
      toast.error('Failed to update note', {
        description: 'From useUpdateNote'
      });
    }
  });
};

export const useRestoreNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const response = await NoteApi.restore(noteId);
      return response.data.data;
    },
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({
        queryKey: ['getDocuments'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['getArchivedResources']
      });
      queryClient.invalidateQueries({
        queryKey: ['getNoteById', noteId]
      });
      queryClient.invalidateQueries({
        queryKey: ['getArchivedNote']
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
        queryKey: ['getArchivedResources']
      });
      queryClient.invalidateQueries({
        queryKey: ['getNoteById', noteId]
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

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const response = await NoteApi.delete(noteId);
      return response.data.data;
    },
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({
        queryKey: ['getDocuments'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['getArchivedResources']
      });
      queryClient.invalidateQueries({
        queryKey: ['getNoteById', noteId]
      });

      toast.success('Note Deleted', {
        description: 'The note has been successfully deleted'
      });
    },
    onError: () => {
      toast.error('Failed to delete the note', {
        description: 'From useDeleteNote'
      });
    }
  });
};
