'use client';

import { CheckIcon, XIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import type { QuizCreateDto } from '@/endpoints/quiz/type';
import {
  useCreateQuestions,
  useDeleteQuestions,
  useUpdateQuestions,
  useUpdateQuiz
} from '@/hooks/quiz/use-quiz';
import type { Answer } from '@/redux/slices/quizSlice';
import type { RootState } from '@/redux/store';

import { QuizHeader } from '../../_components/headers';
import QuizCreateElement from '../../_components/quiz-create-element';

export default function QuizActionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const updateQuizMutation = useUpdateQuiz();
  const createQuestionsMutation = useCreateQuestions();
  const updateQuestionsMutation = useUpdateQuestions();
  const deleteQuestionsMutation = useDeleteQuestions();

  const questions = useSelector((state: RootState) => state.quiz.questions);

  const validateQuiz = (): string | null => {
    for (const question of questions) {
      if (!question.text.trim()) {
        return 'All questions must have text';
      }
      if (
        question.type !== 'short_answer' &&
        question.answers?.length === 0 &&
        !question.isDeleted
      ) {
        return 'All questions must have at least one answer';
      }
      if (
        question.type !== 'short_answer' &&
        !question.answers?.some((answer: Answer) => answer.isCorrect) &&
        !question.isDeleted
      ) {
        return 'Each question must have at least one correct answer';
      }
      if (question.type !== 'short_answer' && question.answers) {
        for (const answer of question.answers) {
          if (!answer.text.trim()) {
            return 'All answer options must have text';
          }
        }
      }
      if (question.type === 'short_answer' && !question.answerText?.trim()) {
        return 'Short answer questions must have an answer text';
      }
    }
    return null;
  };

  const handleSubmit = async (formData: QuizCreateDto) => {
    try {
      const validationError = validateQuiz();
      if (validationError) {
        toast.error(validationError, {
          className: 'text-red-500',
          icon: <XIcon className="text-red-500" />
        });
        return;
      }

      const createArray: {
        question: string;
        questionType: 'single' | 'multiple' | 'short_answer';
        answerOptions?: { option: string; isCorrect: boolean }[];
        answerText?: string;
      }[] = [];
      const updateArray: {
        _id: string;
        question: string;
        questionType: 'single' | 'multiple' | 'short_answer';
        answerOptions?: { option: string; isCorrect: boolean }[];
        answerText?: string;
      }[] = [];
      const deleteArray: string[] = [];

      for (const question of questions) {
        if (question.isDeleted) {
          deleteArray.push(question._id);
        } else if (question.originalAction === 'create') {
          createArray.push({
            question: question.text,
            questionType: question.type,
            answerOptions:
              question.type !== 'short_answer'
                ? question.answers?.map((answer: Answer) => ({
                    option: answer.text,
                    isCorrect: answer.isCorrect
                  }))
                : undefined,
            answerText:
              question.type === 'short_answer' ? question.answerText : undefined
          });
        } else if (question.action === 'update') {
          updateArray.push({
            _id: question._id,
            question: question.text,
            questionType: question.type,
            answerOptions:
              question.type !== 'short_answer'
                ? question.answers?.map((answer: Answer) => ({
                    option: answer.text,
                    isCorrect: answer.isCorrect
                  }))
                : undefined,
            answerText:
              question.type === 'short_answer' ? question.answerText : undefined
          });
        }
      }

      await Promise.all([
        updateQuizMutation.mutateAsync({ _id: id!, data: { ...formData } }),
        createArray.length > 0 &&
          createQuestionsMutation.mutateAsync({
            quizId: id!,
            questions: createArray
          }),
        updateArray.length > 0 &&
          updateQuestionsMutation.mutateAsync({
            quizId: id!,
            questions: updateArray
          }),
        deleteArray.length > 0 &&
          deleteQuestionsMutation.mutateAsync({
            quizId: id!,
            questions: deleteArray
          })
      ]);

      router.replace('/apps/resources/quizzes/view');
      toast.success('Quiz created successfully', {
        className: 'text-green-500',
        icon: <CheckIcon className="text-green-500" />
      });
    } catch {
      toast.error('Failed to create resource');
    }
  };

  return (
    <>
      <QuizHeader onSubmit={handleSubmit} isEditing />
      <div className="flex-1 overflow-hidden">
        <QuizCreateElement />
      </div>
    </>
  );
}
