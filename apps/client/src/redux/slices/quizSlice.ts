import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { Quiz } from '@/types/deck';

interface QuizState {
  quizzes: Quiz[];
  activeQuiz?: Quiz;
  isLoading: boolean;
  error?: string;
}

const initialState: QuizState = {
  quizzes: [],
  activeQuiz: undefined,
  isLoading: false,
  error: undefined
};

// Create the slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizzes(state, action: PayloadAction<Quiz[]>) {
      state.quizzes = action.payload;
    },

    setActiveQuiz(state, action: PayloadAction<Quiz>) {
      state.activeQuiz = action.payload;
    },

    addQuiz(state, action: PayloadAction<Quiz>) {
      state.quizzes.push(action.payload);
    },

    updateQuiz(state, action: PayloadAction<Quiz>) {
      const index = state.quizzes.findIndex(
        (quiz) => quiz._id === action.payload._id
      );
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
    },

    deleteQuiz(state, action: PayloadAction<string>) {
      state.quizzes = state.quizzes.filter(
        (quiz) => quiz._id !== action.payload
      );
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    }
  }
});

export const {
  setQuizzes,
  setActiveQuiz,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  setLoading,
  setError
} = quizSlice.actions;

export default quizSlice.reducer;
