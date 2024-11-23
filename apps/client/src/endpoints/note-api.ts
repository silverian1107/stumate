import { NoteUpdateDto } from '@/types/note';
import { AxiosClient } from './AxiosClient';

export const NoteApi = {
  findByOwner: async function (params: {
    currentPage?: number;
    pageSize?: number;
    qs?: string;
  }) {
    return AxiosClient.get('/notes', {
      params: {
        currentPage: params.currentPage || 1,
        pageSize: params.pageSize || 10,
        qs: params.qs,
      },
    });
  },

  findById: async function (noteId: string) {
    return AxiosClient.get(`/notes/${noteId}`);
  },

  updateById: async function (
    noteId: string,
    {
      name,
      body,
      attachment,
    }: Pick<NoteUpdateDto, 'name' | 'body' | 'attachment'>,
  ) {
    if (body && typeof body === 'object' && 'version' in body) {
      delete (body as Record<string, unknown>).version;
    }
    return AxiosClient.patch(`/notes/${noteId}`, {
      name,
      body,
      attachment,
    });
  },
};
