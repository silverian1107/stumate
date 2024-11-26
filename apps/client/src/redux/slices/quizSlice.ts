import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { Quiz } from '@/types/deck';

// Define the initial state for the quiz slice
interface QuizState {
  quizzes: Quiz[]; // Array to hold multiple quizzes
  activeQuiz?: Quiz; // The currently active or selected quiz
  isLoading: boolean; // Loading state for async operations
  error?: string; // Holds error messages if something goes wrong
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
    // Action to set the quizzes (e.g., after fetching from API)
    setQuizzes(state, action: PayloadAction<Quiz[]>) {
      state.quizzes = action.payload;
    },

    // Action to set a single active quiz
    setActiveQuiz(state, action: PayloadAction<Quiz>) {
      state.activeQuiz = action.payload;
    },

    // Action to add a new quiz
    addQuiz(state, action: PayloadAction<Quiz>) {
      state.quizzes.push(action.payload);
    },

    // Action to update an existing quiz
    updateQuiz(state, action: PayloadAction<Quiz>) {
      const index = state.quizzes.findIndex(
        (quiz) => quiz._id === action.payload._id
      );
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
    },

    // Action to delete a quiz
    deleteQuiz(state, action: PayloadAction<string>) {
      state.quizzes = state.quizzes.filter(
        (quiz) => quiz._id !== action.payload
      );
    },

    // Action to set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    // Action to set an error message
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    }
  }
});

// Export actions and reducer
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
