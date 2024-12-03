import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface Answer {
  _id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
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
        (q) => q._id === action.payload._id
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
      const index = state.questions.findIndex((q) => q._id === action.payload);
      if (index !== -1) {
        state.questions[index].isDeleted = true;
        state.questions[index].action = 'delete';
      }
    },
    restoreQuestion: (state, action: PayloadAction<string>) => {
      const index = state.questions.findIndex((q) => q._id === action.payload);
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
    },
    clearQuestions: (state) => {
      state.questions = [];
    }
  }
});

export const {
  addQuestion,
  updateQuestion,
  markQuestionDeleted,
  restoreQuestion,
  removeAllQuestions,
  clearQuestions
} = quizSlice.actions;
export default quizSlice.reducer;
