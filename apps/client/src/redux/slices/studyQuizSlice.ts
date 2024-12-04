import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { Question } from './quizSlice';

export interface QuizState {
  questions: Question[];
  userAnswers: { [questionId: string]: string[] };
  showResults: boolean;
}

const initialState: QuizState = {
  questions: [],
  userAnswers: {},
  showResults: false
};

const quizStudySlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    setUserAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answerId: string }>
    ) => {
      const { questionId, answerId } = action.payload;
      const question = state.questions.find((q) => q._id === questionId);
      if (question) {
        if (question.type === 'single') {
          state.userAnswers[questionId] = [answerId];
        } else {
          state.userAnswers[questionId] = state.userAnswers[questionId] || [];
          const index = state.userAnswers[questionId].indexOf(answerId);
          if (index > -1) {
            state.userAnswers[questionId].splice(index, 1);
          } else {
            state.userAnswers[questionId].push(answerId);
          }
        }
      }
    },
    setShowResults: (state, action: PayloadAction<boolean>) => {
      state.showResults = action.payload;
    },
    clearAnswers: (state) => {
      state.userAnswers = {};
    }
  }
});

export const { setQuestions, setUserAnswer, setShowResults, clearAnswers } =
  quizStudySlice.actions;
export default quizStudySlice.reducer;
