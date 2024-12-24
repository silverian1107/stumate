import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { Question } from './quizSlice';

interface UserAnswer {
  quizQuestionId: string;
  answer: {
    _id: string;
    answer: string;
  }[];
}

export interface QuizState {
  questions: Question[];
  userAnswers: UserAnswer[];
  showResults: boolean;
}

const initialState: QuizState = {
  questions: [],
  userAnswers: [],
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
      const answer = question?.answers.find((a) => a._id === answerId);
      if (!question || !answer) return;

      const userAnswer = state.userAnswers.find(
        (ua) => ua.quizQuestionId === questionId
      );

      if (question.type === 'single') {
        if (userAnswer) {
          userAnswer.answer = [{ _id: answer._id, answer: answer.text }];
        } else {
          state.userAnswers.push({
            quizQuestionId: questionId,
            answer: [{ _id: answer._id, answer: answer.text }]
          });
        }
      } else if (question.type === 'multiple') {
        if (userAnswer) {
          const existingAnswerIndex = userAnswer.answer.findIndex(
            (a) => a._id === answerId
          );
          if (existingAnswerIndex > -1) {
            userAnswer.answer.splice(existingAnswerIndex, 1);
          } else {
            userAnswer.answer.push({ _id: answer._id, answer: answer.text });
          }
        } else {
          state.userAnswers.push({
            quizQuestionId: questionId,
            answer: [{ _id: answer._id, answer: answer.text }]
          });
        }
      }
    },
    setUserShortAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answerText: string }>
    ) => {
      const { questionId, answerText } = action.payload;
      const question = state.questions.find((q) => q._id === questionId);
      if (!question) return;

      const userAnswer = state.userAnswers.find(
        (ua) => ua.quizQuestionId === questionId
      );

      if (userAnswer) {
        userAnswer.answer = [{ _id: '', answer: answerText }];
      } else {
        state.userAnswers.push({
          quizQuestionId: questionId,
          answer: [{ _id: '', answer: answerText }]
        });
      }
    },
    setShowResults: (state, action: PayloadAction<boolean>) => {
      state.showResults = action.payload;
    },
    clearAnswers: (state) => {
      state.userAnswers = [];
    }
  }
});

export const {
  setQuestions,
  setUserAnswer,
  setUserShortAnswer,
  setShowResults,
  clearAnswers
} = quizStudySlice.actions;
export default quizStudySlice.reducer;
