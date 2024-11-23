import { CollectionClient } from './AxiosClient';

export type CreateCollectionDto = {
  parentId?: string;
  name: string;
  description?: string;
};

export const CollectionApi = {
  async create(data: CreateCollectionDto) {
    const response = await CollectionClient.post('', data);
    return response.data;
  },

  async findByOwner(params: {
    currentPage?: number;
    pageSize?: number;
    qs?: string;
  }) {
    return CollectionClient.get('', {
      params: {
        currentPage: params.currentPage || 1,
        pageSize: params.pageSize || 10,
        qs: params.qs
      }
    });
  },

  async findById(collectionId: string) {
    return CollectionClient.get(`/${collectionId}`);
  }
};
