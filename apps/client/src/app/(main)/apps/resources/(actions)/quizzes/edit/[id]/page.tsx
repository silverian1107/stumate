'use client';

import { CheckIcon, XIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import type { QuizCreateDto } from '@/endpoints/quiz-api';
import {
  useCreateQuestions,
  useDeleteQuestions,
  useUpdateQuestions,
  useUpdateQuiz
} from '@/hooks/use-quiz';
import type { RootState } from '@/redux/store';

import { QuizHeader } from '../../_components/headers';
import QuizCreateElement from '../../_components/quiz-create-element';

export default function ResourcePage() {
  const { id } = useParams<{ id: string }>();
  // const router = useRouter();

  const updateQuizMutation = useUpdateQuiz();
  const createQuestionsMutation = useCreateQuestions();
  const updateQuestionsMutation = useUpdateQuestions();
  const deleteQuestionsMutation = useDeleteQuestions();

  const questions = useSelector((state: RootState) => state.quiz.questions);

  const validateQuiz = () => {
    for (const question of questions) {
      if (!question.text.trim()) {
        return 'All questions must have text';
      }
      if (question.answers.length === 0 && !question.isDeleted) {
        return 'All questions must have at least one answer';
      }
      if (
        !question.answers.some((answer) => answer.isCorrect) &&
        !question.isDeleted
      ) {
        return 'Each question must have at least one correct answer';
      }
      for (const answer of question.answers) {
        if (!answer.text.trim()) {
          return 'All answer options must have text';
        }
      }
    }
    return null;
  };

  const handleSubmit = async (formData: QuizCreateDto) => {
    try {
      if (validateQuiz()) {
        toast.error(validateQuiz, {
          className: 'text-red-500',
          icon: <XIcon className="text-red-500" />
        });
        return;
      }

      const createArray = [];
      const updateArray = [];
      const deleteArray = [];
      console.log('questions', questions);
      for (const question of questions) {
        if (question.isDeleted) {
          deleteArray.push(question._id);
        } else if (question.originalAction === 'create') {
          createArray.push({
            question: question.text,
            questionType: question.type,
            answerOptions: question.answers.map((answer) => ({
              option: answer.text,
              isCorrect: answer.isCorrect
            }))
          });
        } else if (question.action === 'update') {
          updateArray.push({
            _id: question._id,
            question: question.text,
            questionType: question.type,
            answerOptions: question.answers.map((answer) => ({
              option: answer.text,
              isCorrect: answer.isCorrect
            }))
          });
        }
      }

      await Promise.all([
        updateQuizMutation.mutateAsync({ _id: id, data: { ...formData } }),
        createArray.length > 0 &&
          createQuestionsMutation.mutateAsync({
            quizId: id,
            questions: createArray
          }),
        updateArray.length > 0 &&
          updateQuestionsMutation.mutateAsync({
            quizId: id,
            questions: updateArray
          }),
        deleteArray.length > 0 &&
          deleteQuestionsMutation.mutateAsync({
            quizId: id,
            questions: deleteArray
          })
      ]);

      console.log('createArray', createArray);
      console.log('updateArray', updateArray);
      console.log('deleteArray', deleteArray);

      // router.replace('/apps/resources/quizzes/view');
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
      <QuizHeader onSubmit={handleSubmit} />
      <div className="flex-1 overflow-hidden">
        <QuizCreateElement />
      </div>
    </>
  );
}
