'use client';

import {
  ArchiveIcon,
  ArrowLeftIcon,
  CheckIcon,
  Share2Icon,
  Undo2Icon,
  XIcon
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import StatusBar from '@/components/status-bar';
import type { QuizCreateDto } from '@/endpoints/quiz/type';
import {
  useArchiveQuiz,
  useCreateQuestions,
  useDeleteQuestions,
  useDeleteQuiz,
  useQuizById,
  useRestoreQuiz,
  useUpdateQuestions,
  useUpdateQuiz
} from '@/hooks/quiz/use-quiz';
import type { Answer } from '@/redux/slices/quizSlice';
import type { RootState } from '@/redux/store';

import { QuizHeader } from '../../_components/headers';
import QuizCreateElement from '../../_components/quiz-create-element';
import ShareQuizDialog from './share-quiz-dialog';

export default function QuizActionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: quiz, isLoading } = useQuizById(id);

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const updateQuizMutation = useUpdateQuiz();
  const createQuestionsMutation = useCreateQuestions();
  const updateQuestionsMutation = useUpdateQuestions();
  const deleteQuestionsMutation = useDeleteQuestions();

  const archiveQuiz = useArchiveQuiz();
  const restoreQuiz = useRestoreQuiz();
  const deleteQuiz = useDeleteQuiz();

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

  const handleArchive = async () => {
    await archiveQuiz.mutateAsync(id as string);
    toast.success('Quiz archived successfully', {
      className: 'text-green-500',
      icon: <CheckIcon className="text-green-500" />
    });
  };

  const handleRestore = async () => {
    await restoreQuiz.mutateAsync(id as string);
    toast.success('Quiz restored successfully', {
      className: 'text-green-500',
      icon: <CheckIcon className="text-green-500" />
    });
  };

  const handleDelete = async () => {
    await deleteQuiz.mutateAsync(id as string);
    toast.success('Quiz deleted successfully', {
      className: 'text-green-500',
      icon: <CheckIcon className="text-green-500" />
    });
  };

  if (isLoading || !quiz) {
    return null;
  }

  return (
    <>
      <StatusBar
        type="Quiz"
        data={quiz}
        isLoading={isLoading}
        handleRestore={handleRestore}
        handleDelete={handleDelete}
      />
      <div className="size-full flex flex-col px-4 py-8 space-y-6 xl:w-4/5 mx-auto lg:text-base">
        <div className="w-full md:w-3/4 flex justify-start mx-auto gap-2">
          <ArrowLeftIcon
            onClick={() => router.back()}
            className="size-8 p-1 rounded-full text-primary-300 hover:text-primary-600 hover:bg-primary-100 cursor-pointer"
          />
          {!quiz.isArchived && (
            <button
              type="button"
              onClick={handleArchive}
              className="border-primary-500 text-primary-500 border text-sm rounded-md px-2 py-1 flex items-center gap-2 hover:bg-primary-100/80"
            >
              <ArchiveIcon className="size-4" />
              Archive
            </button>
          )}
          {quiz.isArchived && (
            <button
              type="button"
              onClick={handleRestore}
              className="border-primary-500 text-primary-500 border text-sm rounded-md px-2 py-1 flex items-center gap-2 hover:bg-primary-100/80"
            >
              <Undo2Icon className="size-4" />
              Restore
            </button>
          )}
          <button
            type="button"
            className="border-primary-500 text-primary-500 border text-sm rounded-md px-2 py-1 flex items-center gap-2 hover:bg-primary-100/80 ml-auto"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share2Icon className="size-4" />
            Share Quiz
          </button>
        </div>
        <QuizHeader onSubmit={handleSubmit} isEditing />
        <div className="flex-1 overflow-hidden">
          <QuizCreateElement />
        </div>
        <ShareQuizDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          quizId={id!}
        />
      </div>
    </>
  );
}
