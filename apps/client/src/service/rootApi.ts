import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { login, logout } from '../redux/slices/authSlice';
import type { RootState } from '../redux/store';

interface RefreshResponse {
  access_token: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
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

export interface INoteRoot {
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

export interface IUserStatistic {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    userId: string;
    date: string; // ISO date string
    dailyStudyDuration: number;
    studyStreakDays: number;
    totalNotesCount: number;
    totalFlashcardsCount: number;
    notesRevisedTodayCount: number;
    flashcardsDueTodayCount: number;
    totalQuizzesCount: number;
    quizzesCompletedToday: number;
    flashcardsCompletedToday: number;
    flashcardMasteryProgressToday: number;
    accuracyRate: number;
    accuracyRateToday: number;
    lowAccuracyCount: number;
    studiedFlashcardsCount: number;
    dailyTaskList: any[]; // Adjust the type if the structure of tasks is known
    completedTasksCount: number;
    sessionsThisWeek: number;
    monthlyStudyHeatmap: any[]; // Adjust the type if the heatmap structure is known
    deleted: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
  };
}

interface CreatedBy {
  _id: string;
  username: string;
}

export interface Tag {
  _id: string;
  name: string;
  userId: string;
  createdBy: CreatedBy;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IFetchTagsResponse {
  statusCode: number;
  message: string;
  data: {
    userTags: Tag[];
    combinedTags: Tag[];
  };
}

export interface ITagAdmin {
  statusCode: number;
  message: string;
  data: {
    allTags: Tag[];
  };
}
export interface UserInfo {
  _id: string;
  username: string;
  name?: string;
  email: string;
  isActive: boolean;
  codeId?: string;
  codeExpire?: string;
  birthday?: string;
  gender?: string;
  avatarUrl?: string;
  role: 'ADMIN' | 'USER';
  accountType: 'LOCAL' | 'OAUTH';
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  refreshToken?: string;
  lastLogin?: string;
}

interface UserStatistics {
  accuracyRate: number;
  accuracyRateToday: number;
  completedTasksCount: number;
  createdAt: string;
  dailyStudyDuration: number;
  dailyTaskList: string[];
  date: string;
  deleted: boolean;
  flashcardMasteryProgressToday: number;
  flashcardsCompletedToday: number;
  flashcardsDueTodayCount: number;
  lowAccuracyCount: number;
  monthlyStudyHeatmap: any[];
  quizzesCompletedToday: number;
  sessionsThisWeek: number;
  sharedResourcesCount: number;
  studiedFlashcardsCount: number;
  studyStreakDays: number;
  totalFlashcardsCount: number;
  totalNotesCount: number;
  totalQuizzesCount: number;
  updatedAt: string;
  userId: string;
  __v: number;
  _id: string;
}

export interface User {
  user: UserInfo;
  userStatistics: UserStatistics;
}
interface PaginationMeta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface FetchUsersResponse {
  statusCode: number;
  message: string;
  data: {
    meta: PaginationMeta;
    result: UserInfo[];
  };
}
interface InforUser {
  statusCode: number;
  message: string;
  data: User;
}
interface CreateUser {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    craetedAt: string;
  };
}

interface Meta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface Notification {
  _id: string;
  userId: string;
  role: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface NotificationResponse {
  statusCode: number;
  message: string;
  data: {
    meta: Meta;
    result: Notification[];
  };
}

interface AllNotesResponse {
  statusCode: number;
  message: string;
  data: {
    meta: Meta;
    result: INoteRoot[];
  };
}

interface AllArNotesResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    result: INoteRoot[];
  };
}

interface IUser {
  _id: string;
  username: string;
}

export interface IFlashcard {
  _id: string;
  front: string;
  back: string;
  userId: string;
  deckId: string;
  isCloned: boolean;
  sharedWithUsers: string[];
  createdBy: IUser;
  isArchived: boolean;
  archivedAt: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IAllFlashcardsResponse {
  statusCode: number;
  message: string;
  data: {
    meta: Meta;
    result: IFlashcard[];
  };
}

interface AllArFlashcardsResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    result: IFlashcard[];
  };
}

export interface IQuiz {
  _id: string;
  title?: string;
  name?: string;
  description: string;
  numberOfQuestion: number;
  duration: number;
  status: string;
  userId: string;
  tags: string[];
  isCloned: boolean;
  sharedWithUsers: string[];
  createdBy: IUser;
  isArchived: boolean;
  archivedAt: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AllArQuizzesResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    result: IQuiz[];
  };
}

interface IAllQuizzesResponse {
  statusCode: number;
  message: string;
  data: {
    meta: Meta;
    result: IQuiz[];
  };
}

export interface LogEntry {
  id: string;
  datetime: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  originalUrl: string;
  statusCode: number;
  ip: string;
  user?: UserInfo;
  level: 'INFO' | 'WARN' | 'ERROR';
}

interface MetaLog {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

interface LogsResponse {
  statusCode: number;
  message: string;
  data: {
    meta: MetaLog;
    result: LogEntry[];
  };
}

export interface AdminStatisticResponse {
  statusCode: number;
  message: string;
  data: AdminStatisticData;
}

// Data structure
export interface AdminStatisticData {
  overview: Overview;
  monthlyStatisticsChart: MonthlyStatisticsChart;
}

// Overview structure
export interface Overview {
  totalAccounts: number;
  totalNotes: number;
  totalFlashcards: number;
  totalQuizzes: number;
}

// Monthly Statistics Chart structure
export interface MonthlyStatisticsChart {
  totalAccounts: MonthlyData[];
  totalNotes: MonthlyData[];
  totalFlashcards: MonthlyData[];
  totalQuizzes: MonthlyData[];
}

// Monthly data structure
export interface MonthlyData {
  count: number;
  year: number;
  month: number;
}
export interface FilterParams {
  method?: string;
  datetime?: string;
}

export interface TodoItem {
  _id: string;
  userId: string;
  todo: string;
  isCompleted: boolean;
  createdBy: {
    _id: string;
    username: string;
  };
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TodoRes {
  status: number;
  message: string;
  data: TodoItem[];
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'GET'
      },
      api,
      extraOptions
    );

    const { access_token: newAccessToken } =
      refreshResult?.data as RefreshResponse;
    if (newAccessToken) {
      api.dispatch(
        login({
          accessToken: newAccessToken
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      window.location.href = '/login';
    }
  }
  return result;
};

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'NOTE',
    'ATTACHMENT',
    'TAG',
    'USER',
    'USERS',
    'NOTI',
    'TAG_ADMIN',
    'NOTE_ADMIN',
    'ARCHIVE_ADMIN',
    'NOTE_AR',
    'FLASHCARD_ADMIN',
    'ARCHIVE_FLASHCARD_ADMIN',
    'ARCHIVE_QUIZ',
    'ARCHIVE_QUIZ_ADMIN',
    'LOG',
    'TODO'
  ],
  endpoints: (builder) => ({
    register: builder.mutation<
      { token: string },
      { username: string; email: string; password: string }
    >({
      query: ({ username, email, password }) => ({
        url: '/auth/register',
        body: { username, email, password },
        method: 'POST'
      })
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
        method: 'POST'
      })
    }),
    verifyOTP: builder.mutation<
      { success: boolean },
      { email: string; codeId: string }
    >({
      query: ({ email, codeId }) => ({
        url: '/auth/verify-activation-code',
        body: { email, codeId },
        method: 'POST'
      })
    }),
    resendOTP: builder.mutation<{ success: boolean }, { email: string }>({
      query: ({ email }) => ({
        url: '/resend-otp',
        body: { email },
        method: 'POST'
      })
    }),
    refreshToken: builder.query<any, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET'
      })
    }),
    uploadFiles: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: '/attachments/uploads',
        body: formData,
        method: 'POST'
      })
    }),
    deleteFile: builder.mutation<{ message: string }, { fileName: string }>({
      query: ({ fileName }) => ({
        url: `/attachments/${fileName}`,
        body: { fileName },
        method: 'DELETE'
      })
    }),

    createNote: builder.mutation<CreateNoteResponse, CreateNoteRequest>({
      query: ({ parentId, name }) => ({
        url: '/notes',
        body: { parentId, name },
        method: 'POST'
      })
    }),
    updateNote: builder.mutation<CreateNoteResponse, IUpdateNoteRequest>({
      query: ({ name, noteId, body, attachment }) => ({
        url: `/notes/${noteId}`,
        body: { name, body, attachment },
        method: 'PATCH'
      }),
      invalidatesTags: (result, error, { noteId }) => [
        { type: 'NOTE', id: noteId }
      ]
    }),
    getNoteById: builder.query<SingleNodeRespone, string>({
      query: (id: string) => ({
        url: `/notes/${id}`
      }),
      providesTags: (result, error, id) => [{ type: 'NOTE', id }]
    }),
    archiveNoteById: builder.mutation<
      { status: number; description: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/notes/${id}/archive`,
        method: 'POST'
      }),
      invalidatesTags: [{ type: 'ARCHIVE_ADMIN' }]
    }),
    statistics: builder.query<IUserStatistic, void>({
      query: () => {
        return '/statistics';
      }
    }),
    tag: builder.query<IFetchTagsResponse, void>({
      query: () => {
        return '/tags';
      },
      providesTags: [{ type: 'TAG' }]
    }),
    tagAdmin: builder.query<ITagAdmin, void>({
      query: () => {
        return '/tags';
      },
      providesTags: [{ type: 'TAG_ADMIN' }]
    }),
    createTag: builder.mutation<
      { message: string; status: number },
      { name: string }
    >({
      query: ({ name }) => ({
        url: '/tags',
        method: 'POST',
        body: { name }
      }),
      invalidatesTags: [{ type: 'TAG' }, { type: 'TAG_ADMIN' }]
    }),
    deleteTag: builder.mutation({
      query: (id) => ({
        url: `/tags/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'TAG' }, { type: 'TAG_ADMIN' }]
    }),
    renameTag: builder.mutation<
      { status: number; message: string; data: Tag },
      { name: string; id: string }
    >({
      query: ({ name, id }) => ({
        url: `/tags/${id}`,
        body: { name },
        method: 'PATCH'
      }),
      invalidatesTags: [{ type: 'TAG' }, { type: 'TAG_ADMIN' }]
    }),
    getInfoUser: builder.query<InforUser, { id: string }>({
      query: ({ id }) => {
        return `/users/${id}`;
      },
      providesTags: [{ type: 'USERS' }]
    }),
    getAllUser: builder.query<FetchUsersResponse, { current: number }>({
      query: ({ current }) => ({
        url: '/users',
        params: { current },
        method: 'GET'
      }),
      providesTags: [{ type: 'USERS' }]
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'USERS' }]
    }),
    createUser: builder.mutation<
      CreateUser,
      { username: string; email: string; password: string; role: string }
    >({
      query: ({ username, email, password, role }) => ({
        url: '/users',
        method: 'POST',
        body: { username, email, password, role }
      }),
      invalidatesTags: [{ type: 'USERS' }]
    }),
    updateUser: builder.mutation<{ status: number; message: string }, any>({
      query: (user) => ({
        url: '/users',
        method: 'PATCH',
        body: user
      }),
      invalidatesTags: [{ type: 'USERS' }]
    }),
    createNotification: builder.mutation<
      { statusCode: number; message: string },
      { title: string; type: string; body: string }
    >({
      query: ({ title, type, body }) => ({
        url: '/notifications/admin/send',
        method: 'POST',
        body: { title, type, body }
      }),
      invalidatesTags: [{ type: 'NOTI' }]
    }),
    getALlNotifications: builder.query<
      NotificationResponse,
      { current: number; title: string; createdAt: string }
    >({
      query: ({ current, title, createdAt }) => ({
        url: 'notifications/all',
        params: { current, title, createdAt },
        method: 'GET'
      }),
      providesTags: [{ type: 'NOTI' }]
    }),
    deleteNoti: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'NOTI' }]
    }),
    updateNoti: builder.mutation<{ status: number; message: string }, any>({
      query: (noti) => ({
        url: `/notifications/${noti.id}`,
        method: 'PATCH',
        body: { title: noti.title, body: noti.body, type: noti.type }
      }),
      invalidatesTags: [{ type: 'NOTI' }]
    }),
    getAllNotes: builder.query<
      AllNotesResponse,
      { currentPage: number; createdAt: string }
    >({
      query: ({ currentPage, createdAt }) => ({
        url: 'notes/all',
        params: { currentPage, createdAt },
        method: 'GET'
      }),
      providesTags: [{ type: 'NOTE_ADMIN' }, { type: 'ARCHIVE_ADMIN' }]
    }),
    getAllArNotes: builder.query<AllArNotesResponse, void>({
      query: () => ({
        url: 'notes/archived-resources/all',
        method: 'GET'
      }),
      providesTags: [{ type: 'NOTE_AR' }]
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: `/notes/${id}/delete`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'NOTE_AR' }]
    }),
    restoreNoteById: builder.mutation<
      { status: number; description: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/notes/${id}/restore`,
        method: 'POST'
      }),
      invalidatesTags: [{ type: 'ARCHIVE_ADMIN' }, { type: 'NOTE_AR' }]
    }),
    getAllFlashcard: builder.query<
      IAllFlashcardsResponse,
      { current: number; createdAt: string }
    >({
      query: ({ current, createdAt }) => ({
        url: '/flashcards',
        params: { current, createdAt },
        method: 'GET'
      }),
      providesTags: [
        { type: 'FLASHCARD_ADMIN' },
        { type: 'ARCHIVE_FLASHCARD_ADMIN' }
      ]
    }),
    archiveFlashcardById: builder.mutation<
      { status: number; description: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/flashcards/archive/${id}`,
        method: 'PATCH'
      }),
      invalidatesTags: [
        { type: 'ARCHIVE_FLASHCARD_ADMIN' },
        { type: 'FLASHCARD_ADMIN' }
      ]
    }),
    getAllArFlashcards: builder.query<AllArFlashcardsResponse, void>({
      query: () => ({
        url: 'flashcards/archived',
        method: 'GET'
      }),
      providesTags: [{ type: 'ARCHIVE_FLASHCARD_ADMIN' }]
    }),
    deleteFlashcard: builder.mutation({
      query: ({ id }) => ({
        url: `/flashcards/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'ARCHIVE_FLASHCARD_ADMIN' }]
    }),
    restoreFlashcardById: builder.mutation<
      { status: number; description: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/flashcards/restore/${id}`,
        method: 'PATCH'
      }),
      invalidatesTags: [
        { type: 'ARCHIVE_ADMIN' },
        { type: 'ARCHIVE_FLASHCARD_ADMIN' }
      ]
    }),
    getAllQuizzes: builder.query<
      IAllQuizzesResponse,
      { current: number; createdAt: string }
    >({
      query: ({ current, createdAt }) => ({
        url: '/quiz-tests/all',
        params: { current, createdAt },
        method: 'GET'
      }),
      providesTags: [{ type: 'ARCHIVE_QUIZ' }, { type: 'ARCHIVE_QUIZ_ADMIN' }]
    }),
    archiveQuizById: builder.mutation<
      { status: number; description: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/quizzes/${id}/archive`,
        method: 'POST'
      }),
      invalidatesTags: [
        { type: 'ARCHIVE_QUIZ_ADMIN' },
        { type: 'ARCHIVE_QUIZ' }
      ]
    }),
    getAllArQuizzes: builder.query<AllArQuizzesResponse, void>({
      query: () => ({
        url: '/quizzes/archived-resources/all',
        method: 'GET'
      }),
      providesTags: [{ type: 'ARCHIVE_QUIZ' }]
    }),
    deleteQuiz: builder.mutation({
      query: ({ id }) => ({
        url: `/quiz-tests/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'ARCHIVE_QUIZ' }]
    }),
    restoreQuizById: builder.mutation<
      { status: number; description: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/quizzes/${id}/restore`,
        method: 'POST'
      }),
      invalidatesTags: [
        { type: 'ARCHIVE_QUIZ' },
        { type: 'ARCHIVE_QUIZ_ADMIN' }
      ]
    }),
    getLogs: builder.query<
      LogsResponse,
      { currentPage: number; filters: FilterParams }
    >({
      query: ({ currentPage, filters }) => ({
        url: 'mylogs',
        params: { currentPage, ...filters },
        method: 'GET'
      }),
      providesTags: [{ type: 'LOG' }]
    }),
    deleteLog: builder.mutation({
      query: ({ id }) => ({
        url: `/mylogs/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'LOG' }]
    }),
    getStatisticsAdmin: builder.query<AdminStatisticResponse, void>({
      query: () => {
        return '/statistics/admin';
      }
    }),
    editAvatar: builder.mutation<
      { status: number; message: string },
      { avatarUrl: string }
    >({
      query: (avatarUrl) => ({
        url: '/users',
        method: 'PATCH',
        body: { avatarUrl }
      }),
      invalidatesTags: [{ type: 'USERS' }]
    }),
    getTodo: builder.query<TodoRes, void>({
      query: () => {
        return '/todo';
      },
      providesTags: [{ type: 'TODO' }]
    }),
    completeTodo: builder.mutation<
      { status: number; message: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/todo/${id}/completed`,
        method: 'PATCH'
      }),
      invalidatesTags: [{ type: 'TODO' }]
    }),
    editTodo: builder.mutation<
      { status: number; message: string },
      { id: string; todo: string }
    >({
      query: ({ id, todo }) => ({
        url: `/todo/${id}`,
        method: 'PATCH',
        body: { todo }
      }),
      invalidatesTags: [{ type: 'TODO' }]
    }),
    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/todo/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'TODO' }]
    }),
    addTodo: builder.mutation<
      { status: number; message: string },
      { todo: string }
    >({
      query: ({ todo }) => ({
        url: '/todo',
        method: 'POST',
        body: { todo }
      }),
      invalidatesTags: [{ type: 'TODO' }]
    })
  })
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useUploadFilesMutation,
  useDeleteFileMutation,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useGetNoteByIdQuery,
  useArchiveNoteByIdMutation,
  useStatisticsQuery,
  useTagQuery,
  useCreateTagMutation,
  useDeleteTagMutation,
  useRenameTagMutation,
  useGetInfoUserQuery,
  useGetAllUserQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useCreateNotificationMutation,
  useTagAdminQuery,
  useGetALlNotificationsQuery,
  useDeleteNotiMutation,
  useUpdateNotiMutation,
  useGetAllNotesQuery,
  useDeleteNoteMutation,
  useGetAllArNotesQuery,
  useRestoreNoteByIdMutation,
  useGetAllFlashcardQuery,
  useArchiveFlashcardByIdMutation,
  useGetAllArFlashcardsQuery,
  useDeleteFlashcardMutation,
  useGetAllQuizzesQuery,
  useArchiveQuizByIdMutation,
  useGetAllArQuizzesQuery,
  useDeleteQuizMutation,
  useRestoreQuizByIdMutation,
  useRestoreFlashcardByIdMutation,
  useGetLogsQuery,
  useDeleteLogMutation,
  useGetStatisticsAdminQuery,
  useEditAvatarMutation,
  useRefreshTokenQuery,
  useCompleteTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
  useGetTodoQuery,
  useAddTodoMutation
} = rootApi;
