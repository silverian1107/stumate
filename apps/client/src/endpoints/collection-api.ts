import { AxiosClient } from './AxiosClient';

export const CollectionApi = {
  async findByOwner(params: {
    currentPage?: number;
    pageSize?: number;
    qs?: string;
  }) {
    return AxiosClient.get('/collections', {
      params: {
        currentPage: params.currentPage || 1,
        pageSize: params.pageSize || 10,
        qs: params.qs
      }
    });
  },

  async findById(collectionId: string) {
    return AxiosClient.get(`/collections/${collectionId}`);
  }
};
