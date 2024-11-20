import { AxiosClient } from './AxiosClient';

export const NoteApi = {
  async findByOwner(params: {
    currentPage?: number;
    pageSize?: number;
    qs?: string;
  }) {
    return AxiosClient.get('/notes', {
      params: {
        currentPage: params.currentPage || 1,
        pageSize: params.pageSize || 10,
        qs: params.qs
      }
    });
  },

  async findById(collectionId: string) {
    return AxiosClient.get(`/notes/${collectionId}`);
  }
};
