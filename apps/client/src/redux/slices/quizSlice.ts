import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  answers: Answer[];
}

interface QuizState {
  questions: Question[];
}

const initialState: QuizState = {
  questions: []
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(
        (q) => q.id === action.payload.id
      );
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((q) => q.id !== action.payload);
    },
    removeAllQuestions: (state) => {
      state.questions = [];
    }
  }
});

export const {
  addQuestion,
  updateQuestion,
  removeQuestion,
  removeAllQuestions
} = quizSlice.actions;
export default quizSlice.reducer;

// export { addQuestion, updateQuestion, removeQuestion };
