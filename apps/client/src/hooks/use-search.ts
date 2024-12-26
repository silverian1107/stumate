'use client';

import { useQuery } from '@tanstack/react-query';

import { SearchApi } from '@/endpoints/search-api';

export const useSearch = (query: string, currentPage = 1, pageSize = 25) => {
  return useQuery({
    queryKey: ['search', query, currentPage, pageSize],
    queryFn: async () => {
      const response = await SearchApi.search(query, currentPage, pageSize);
      return response;
    },
    staleTime: 5 * 60 * 1000 // Data stays fresh for 5 minutes
  });
};
