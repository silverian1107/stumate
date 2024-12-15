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
  },
  async archive(resourceId: string) {
    return NoteClient.post(`${resourceId}/archive`);
  },

  async restore(resourceId: string) {
    return NoteClient.post(`${resourceId}/restore`);
  },

  async getSummaryByNoteId(noteId: string) {
    return NoteClient.get(`${noteId}/summaries`);
  },

  async createSummary(noteId: string) {
    return NoteClient.post(`${noteId}/summaries/ai`);
  },

  async updateSummary(noteId: string, summaryId: string, content?: string) {
    return NoteClient.patch(`${noteId}/summaries/${summaryId}`, {
      content: content || ''
    });
  }
};
