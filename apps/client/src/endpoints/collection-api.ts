import { CollectionClient, NoteClient } from './AxiosClient';

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
  },

  async getArchivedByOwner() {
    const response = await CollectionClient.get('/archived');
    return response.data;
  },

  async archive(resourceId: string) {
    return CollectionClient.post(`${resourceId}/archive`);
  },

  async getArchivedResources() {
    const [noteResponse, collectionResponse] = await Promise.all([
      NoteClient.get('/archived-resources/all'),
      CollectionClient.get('/archived-resources/all')
    ]);

    const notes = noteResponse.data?.data?.result || [];
    const collections = collectionResponse.data?.data?.result || [];

    const mergedResources = [...notes, ...collections].sort(
      (a, b) =>
        new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()
    );

    return {
      data: mergedResources
    };
  },

  async restore(resourceId: string) {
    return CollectionClient.post(`${resourceId}/restore`);
  }
};
