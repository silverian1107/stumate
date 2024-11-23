'use client';

import { NoteApi } from '@/endpoints/note-api';
import { NoteUpdateDto } from '@/types/note';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useNoteById = (noteId: string) => {
  return useQuery({
    queryKey: ['getNoteById', noteId],
    queryFn: async () => {
      return NoteApi.findById(noteId)
        .then((res) => res.data.data)
        .catch();
    },
  });
};

export const useUpdateNote = () => {
  return useMutation({
    mutationFn: async ({ _id, name, body, attachment }: NoteUpdateDto) => {
      return NoteApi.updateById(_id, { name, body, attachment });
    },
    onError: (error) => console.log(error),
  });
};
