import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AxiosClient } from '@/endpoints/AxiosClient';

export interface AccountResponse {
  statusCode: number;
  message: string;
  data: {
    user: {
      email: string;
      username: string;
      role: 'USER' | 'ADMIN';
      _id: string;
    };
  };
}

export const useAccount = () => {
  const hasToken = !!Cookies.get('access_token');
  const router = useRouter();

  const { data, isLoading, error } = useQuery<
    AccountResponse,
    AxiosError | null
  >({
    queryKey: ['getAccount'],
    queryFn: async () => {
      const response = await AxiosClient.get('/auth/account');
      return response.data;
    },
    enabled: !!Cookies.get('access_token'),
    retry: false
  });

  console.log(data);
  useEffect(() => {
    if (!hasToken) {
      router.replace('/');
    }
  }, [hasToken, router]);

  return { data, isLoading, error: hasToken ? error : 1 };
};
