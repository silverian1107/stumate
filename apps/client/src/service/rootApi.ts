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

interface UploadResponse {
  success: boolean;
  message: string;
  fileURL: string;
}

interface CreateNoteResponse {
  status: number;
  description: string;
}

interface INoteBody {
  time: number;
  blocks: any[];
}

interface CreateNoteRequest {
  // ownerId: string;
  // body: INoteBody;
  name: string;
  parentId: string;
  // attachment: string[];
}

interface IUpdateNoteRequest {
  noteId: string;
  name: string;
  body: INoteBody;
  attachment: string[];
}

interface INoteRoot {
  _id: string;
  ownerId: string;
  parentId: string;
  type: string;
  name: string;
  level: number;
  position: number;
  isPublished: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  attachment: string[];
  tags: any[];
  sharedWithUsers: any[];
  deleted: boolean;
  children: any[];
  createdAt: string;
  updatedAt: string;
  body: IBody;
}

interface IBody {
  time: number;
  blocks: any[];
  _id: string;
  deleted: boolean;
}

interface SingleNodeRespone {
  data: INoteRoot;
  message: string;
  statusCode: number;
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
  tagTypes: ['NOTE', 'ATTACHMENT'],
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
      { email: string; codeId: string }
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
    uploadFiles: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: '/attachments/uploads',
        body: formData,
        method: 'POST',
      }),
    }),
    deleteFile: builder.mutation<{ message: string }, { fileName: string }>({
      query: ({ fileName }) => ({
        url: `/attachments/${fileName}`,
        body: { fileName },
        method: 'DELETE',
      }),
    }),

    createNote: builder.mutation<CreateNoteResponse, CreateNoteRequest>({
      query: ({ parentId, name }) => ({
        url: '/notes',
        body: { parentId, name },
        method: 'POST',
      }),
    }),
    updateNote: builder.mutation<CreateNoteResponse, IUpdateNoteRequest>({
      query: ({ name, noteId, body, attachment }) => ({
        url: `/notes/${noteId}`,
        body: { name, body, attachment },
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, { noteId }) => [
        { type: 'NOTE', id: noteId },
      ],
    }),
    getNoteById: builder.query<SingleNodeRespone, string>({
      query: (id: string) => ({
        url: `/notes/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'NOTE', id }],
    }),
    archiveNoteById: builder.mutation<
      { status: number; description: string },
      string
    >({
      query: (id: string) => ({
        url: `/notes/${id}/archive`,
        method: 'PATCH',
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
  useUploadFilesMutation,
  useDeleteFileMutation,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useGetNoteByIdQuery,
  useArchiveNoteByIdMutation,
} = rootApi;
