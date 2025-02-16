'use client';

import { CheckIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import type { QuizCreateDto } from '@/endpoints/quiz/type';
import { useCreateQuestions, useQuizCreate } from '@/hooks/quiz/use-quiz';
import type { RootState } from '@/redux/store';

import { QuizHeader } from '../_components/headers';
import QuizCreateElement from '../_components/quiz-create-element';

export default function ResourcePage() {
  const createQuiz = useQuizCreate();
  const createQuestions = useCreateQuestions();
  const questions = useSelector((state: RootState) => state.quiz.questions);
  const router = useRouter();

  const validateQuiz = () => {
    for (const question of questions) {
      if (!question.text.trim()) {
        return 'All questions must have text';
      }
      if (question.type !== 'short_answer' && question.answers.length === 0) {
        return 'All questions must have at least one answer';
      }
      if (
        question.type !== 'short_answer' &&
        !question.answers.some((answer) => answer.isCorrect)
      ) {
        return 'Each question must have at least one correct answer';
      }
      if (question.type !== 'short_answer') {
        for (const answer of question.answers) {
          if (!answer.text.trim()) {
            return 'All answer options must have text';
          }
        }
      } else if (!question.answerText?.trim()) {
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

      const payload = questions.map((question) => ({
        question: question.text,
        questionType: question.type,
        answerOptions:
          question.type !== 'short_answer'
            ? question.answers.map((option) => ({
                option: option.text,
                isCorrect: option.isCorrect
              }))
            : undefined,
        answerText:
          question.type === 'short_answer' ? question.answerText : undefined,
        point: 1
      }));

      const quizId = (await createQuiz.mutateAsync(formData))._id;
      await createQuestions.mutateAsync({ quizId, questions: payload });
      toast.success('Quiz created successfully', {
        className: 'text-green-500',
        icon: <CheckIcon className="text-green-500" />
      });
      router.push('/apps/resources/quizzes/view');
    } catch {
      toast.error('Failed to create resource');
    }
  };

  return (
    <div className="size-full flex flex-col px-4 py-8 pb-2 space-y-6 xl:w-4/5 mx-auto lg:text-base">
      <QuizHeader onSubmit={handleSubmit} />
      <div className="flex-1 overflow-hidden">
        <QuizCreateElement />
      </div>
    </div>
  );
}
