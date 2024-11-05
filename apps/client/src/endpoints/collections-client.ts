import { AxiosClient } from './AxiosClient';

export const CollectionEndpoint = {
  findByOwner: async function (params: {
    currentPage?: number;
    pageSize?: number;
    qs?: string;
  }) {
    return AxiosClient.get('/collections', {
      params: {
        currentPage: params.currentPage || 1,
        pageSize: params.pageSize || 10,
        qs: params.qs,
      },
    });
  },

  findById: async function (collectionId: string) {
    return AxiosClient.get(`/collections/${collectionId}`);
  },
};
