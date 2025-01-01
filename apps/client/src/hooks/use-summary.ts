import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { NoteApi } from '@/endpoints/note-api';

export const useSummaryByNoteId = () => {
  const { id: noteId } = useParams<{ id: string }>();
  return useQuery({
    queryKey: ['getSummary', noteId],
    queryFn: async () => {
      return NoteApi.getSummaryByNoteId(noteId)
        .then((res) => res.data.data)
        .catch();
    }
  });
};

export const useCreateSummary = () => {
  const { id: noteId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await NoteApi.createSummary(noteId);

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getSummary', noteId]
      });

      queryClient.invalidateQueries({
        queryKey: ['getNoteById', noteId]
      });

      toast.success('Summary created successfully');
    },
    onError: () => {
      toast.error('Failed to create summary', {
        description: 'From useCreateSummary'
      });
    }
  });
};

export const useUpdateSummary = () => {
  const { id: noteId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      summaryId
    }: {
      content?: string;
      summaryId: string;
    }) => {
      const response = await NoteApi.updateSummary(noteId, summaryId, content);

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getSummary', noteId]
      });

      queryClient.invalidateQueries({
        queryKey: ['getNoteById', noteId]
      });

      toast.success('Summary updated successfully');
    },
    onError: () => {
      toast.error('Failed to update summary', {
        description: 'From useSaveSummary'
      });
    }
  });
};
