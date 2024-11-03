/* eslint-disable @typescript-eslint/no-explicit-any */
import { login, logout } from '../redux/slices/authSlice';
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../redux/store';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userInfo?: Record<string, any>;
}
interface RefreshResponse {
  accessToken: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  if (result?.error?.status === 401 && result?.error) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          body: { refreshToken },
          method: 'POST',
        },
        api,
        extraOptions,
      );

      const { accessToken: newAccessToken } =
        refreshResult?.data as RefreshResponse;
      if (newAccessToken) {
        api.dispatch(
          login({
            accessToken: newAccessToken,
            refreshToken,
          }),
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
        window.location.href = '/login';
      }
    }
  }
  return result;
};

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<
      { token: string },
      { username: string; email: string; password: string }
    >({
      query: ({ username, email, password }) => ({
        url: '/auth/register',
        body: { username, email, password },
        method: 'POST',
      }),
    }),
    login: builder.mutation<
      {
        statusCode: number;
        access_token: string;
        refresh_token: string;
        token: string;
        data: Record<string, any>;
        message: string;
      },
      { username: string; password: string }
    >({
      query: ({ username, password }) => ({
        url: '/auth/login',
        body: { username, password },
        method: 'POST',
      }),
    }),
    verifyOTP: builder.mutation<
      { success: boolean },
      { email: string; otp: string }
    >({
      query: ({ email, codeId }) => ({
        url: '/auth/verify-activation-code',
        body: { email, codeId },
        method: 'POST',
      }),
    }),
    resendOTP: builder.mutation<{ success: boolean }, { email: string }>({
      query: ({ email }) => ({
        url: '/resend-otp',
        body: { email },
        method: 'POST',
      }),
    }),
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: ({ refreshToken }) => ({
        url: '/auth/refresh',
        body: { refreshToken },
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useRefreshTokenMutation,
} = rootApi;
