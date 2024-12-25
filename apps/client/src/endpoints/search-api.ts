import { SearchClient } from './AxiosClient';

interface SearchResponseData {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: [];
}

interface SearchResponse {
  statusCode: number;
  message: string;
  data: SearchResponseData;
}

export const SearchApi = {
  async search(
    query: string,
    currentPage = 1,
    pageSize = 10
  ): Promise<SearchResponseData> {
    const response = await SearchClient.get<SearchResponse>('/', {
      params: {
        query,
        currentPage,
        pageSize
      }
    });
    return response.data.data;
  }
};
