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
    const response = await CollectionClient.get('', {
      params: {
        currentPage: params.currentPage || 1,
        pageSize: params.pageSize || 10,
        qs: params.qs
      }
    });
    return response.data;
  },

  async findById(collectionId: string) {
    const response = await CollectionClient.get(`/${collectionId}`);
    return response.data;
  }
};
