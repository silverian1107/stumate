import { TagClient } from './AxiosClient';

export enum ResourceTypeEnum {
  Collection = 'collections',
  Note = 'notes',
  Deck = 'decks',
  Quiz = 'quiz-tests'
}

export const TagApi = {
  async create(name: string) {
    return TagClient.post('', { name });
  },
  async findByUser() {
    return TagClient.get('');
  },
  async assign(resource: ResourceTypeEnum, resourceId: string, tagId: string) {
    return TagClient.post(`assign-tag/${resource}/${resourceId}/${tagId}`);
  },
  async unassign(
    resource: ResourceTypeEnum,
    resourceId: string,
    tagId: string
  ) {
    return TagClient.post(`unassign/${resource}/${resourceId}/${tagId}`);
  }
};
