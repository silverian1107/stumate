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
  action?: 'create' | 'update' | 'delete';
  originalAction?: 'create' | 'update';
  isDeleted?: boolean;
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
      const newQuestion = {
        ...action.payload,
        action: 'create' as 'delete' | 'create' | 'update',
        originalAction: 'create' as 'create' | 'update',
        isDeleted: false
      };
      state.questions.push(newQuestion);
    },
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(
        (q) => q.id === action.payload.id
      );
      if (index !== -1) {
        const existingQuestion = state.questions[index];
        state.questions[index] = {
          ...action.payload,
          originalAction: existingQuestion.originalAction,
          action:
            existingQuestion.originalAction === 'update'
              ? 'update'
              : existingQuestion.action,
          isDeleted: false
        };
      }
    },
    markQuestionDeleted: (state, action: PayloadAction<string>) => {
      const index = state.questions.findIndex((q) => q.id === action.payload);
      if (index !== -1) {
        state.questions[index].isDeleted = true;
        state.questions[index].action = 'delete';
      }
    },
    restoreQuestion: (state, action: PayloadAction<string>) => {
      const index = state.questions.findIndex((q) => q.id === action.payload);
      if (index !== -1 && state.questions[index].isDeleted) {
        state.questions[index].isDeleted = false;
        state.questions[index].action = state.questions[index].originalAction;
      }
    },
    removeAllQuestions: (state) => {
      state.questions = state.questions.map((q) => ({
        ...q,
        isDeleted: true,
        action: 'delete'
      }));
    }
  }
});

export const {
  addQuestion,
  updateQuestion,
  markQuestionDeleted,
  restoreQuestion,
  removeAllQuestions
} = quizSlice.actions;
export default quizSlice.reducer;
