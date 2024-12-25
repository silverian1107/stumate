import axios from 'axios';
import Cookies from 'js-cookie';

export const UnauthAxiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const AxiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

AxiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createCustomClient = (customBaseURL: string) => {
  const customClient = axios.create({
    ...AxiosClient.defaults,
    baseURL: customBaseURL
  });

  // @ts-expect-error ts(2349)
  AxiosClient.interceptors.request.forEach((interceptor) =>
    customClient.interceptors.request.use(
      interceptor.fulfilled,
      interceptor.rejected
    )
  );

  return customClient;
};

const CollectionClient = createCustomClient(
  'http://localhost:3000/api/collections'
);
const NoteClient = createCustomClient('http://localhost:3000/api/notes');
const DeckClient = createCustomClient('http://localhost:3000/api/decks');
const QuizClient = createCustomClient('http://localhost:3000/api/quiz-tests');
const TagClient = createCustomClient('http://localhost:3000/api/tags');
const SearchClient = createCustomClient('http://localhost:3000/api/search');

export {
  CollectionClient,
  DeckClient,
  NoteClient,
  QuizClient,
  SearchClient,
  TagClient
};
