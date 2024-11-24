import type { CreateNoteProps } from '@/types/collection';
import type { NoteUpdateDto } from '@/types/note';

import { NoteClient } from './AxiosClient';

export const NoteApi = {
  async create(data: CreateNoteProps) {
    return NoteClient.post('', data);
  },

  async findByOwner(params: {
    currentPage?: number;
    pageSize?: number;
    qs?: string;
  }) {
    return NoteClient.get('/', {
      params: {
        currentPage: params.currentPage || 1,
        pageSize: params.pageSize || 10,
        qs: params.qs
      }
    });
  },

  async findById(noteId: string) {
    const response = await NoteClient.get(`/${noteId}`);
    return response.data;
  },

  async updateById(
    noteId: string,
    {
      name,
      body,
      attachment
    }: Pick<NoteUpdateDto, 'name' | 'body' | 'attachment'>
  ) {
    if (body && typeof body === 'object' && 'version' in body) {
      delete (body as unknown as Record<string, unknown>).version;
    }
    return NoteClient.patch(`/${noteId}`, {
      name,
      body,
      attachment
    });
  }
};
