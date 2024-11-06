import { AxiosClient } from '@/endpoints/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

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
    retry: false,
  });

  return { data, isLoading, error: hasToken ? error : 1 };
};
