'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { NoteApi } from '@/endpoints/note-api';
import type { NoteUpdateDto } from '@/types/note';

export const useNoteById = (noteId: string) => {
  return useQuery({
    queryKey: ['getNoteById', noteId],
    queryFn: async () => {
      return NoteApi.findById(noteId)
        .then((res) => res.data.data)
        .catch();
    }
  });
};

export const useUpdateNote = () => {
  return useMutation({
    mutationFn: async ({ _id, name, body, attachment }: NoteUpdateDto) => {
      return NoteApi.updateById(_id, { name, body, attachment });
    },
    onError: () => {
      toast.error('Failed to update note', {
        description: 'From useUpdateNote'
      });
    }
  });
};
