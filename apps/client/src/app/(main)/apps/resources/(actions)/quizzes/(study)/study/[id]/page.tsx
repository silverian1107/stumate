'use client';

import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useQuizAttemptData,
  useSubmitQuizAttempt
} from '@/hooks/quiz/use-quiz-attempt';
import {
  clearAnswers,
  setQuestions,
  setShowResults,
  setUserAnswer,
  setUserShortAnswer
} from '@/redux/slices/studyQuizSlice';
import type { AppDispatch, RootState } from '@/redux/store';

import QuizStudyProgress from '../../../../../../../../../components/quiz/quiz-study/QuizStudyProgress';
import QuizStudyQuestion from '../../../../../../../../../components/quiz/quiz-study/QuizStudyQuestion';
import QuizStudyResults from '../../../../../../../../../components/quiz/quiz-study/QuizStudyResults';
import QuizStudySubmitButton from '../../../../../../../../../components/quiz/quiz-study/QuizStudySubmitButton';
import { mapQuizBackendToFrontend } from '../../../_components/QuizCreator';
import ConfirmDialog from '../../prepare/_components/confirm-dialog';
import QuestionStatus from '../../prepare/_components/question-status';

const QuizStudyPage: React.FC = () => {
  const router = useRouter();

  const { data, isLoading, error } = useQuizAttemptData();
  const submitQuizAttempt = useSubmitQuizAttempt();

  const dispatch = useDispatch<AppDispatch>();
  const { questions, userAnswers, showResults } = useSelector(
    (state: RootState) => state.quizStudy
  );

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (data && data.quizAttempt?.status === 'COMPLETED') {
      dispatch(setShowResults(true));
    } else if (data) {
      const formattedQuestions = mapQuizBackendToFrontend(data.questions);
      dispatch(setShowResults(false));
      dispatch(setQuestions(formattedQuestions));
    }
  }, [data, dispatch]);

  const handleAnswerChange = (questionId: string, answerId: string) => {
    dispatch(setUserAnswer({ questionId, answerId }));
  };

  const handleShortAnswerChange = (questionId: string, answerText: string) => {
    dispatch(setUserShortAnswer({ questionId, answerText }));
  };

  const isQuestionAnswered = (questionId: string) => {
    const answered = userAnswers.find((ua) => ua.quizQuestionId === questionId);
    return Boolean(answered && answered.answer.length > 0);
  };

  const calculateScore = () => {
    let score = 0;

    questions.forEach((question) => {
      const userAnswer = userAnswers.find(
        (ua) => ua.quizQuestionId === question._id
      );

      const userAnswerIds = userAnswer?.answer.map((a) => a._id) || [];
      const correctAnswerIds = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a._id);

      if (question.type === 'single') {
        if (
          userAnswerIds.length === 1 &&
          userAnswerIds[0] === correctAnswerIds[0]
        ) {
          score += 1;
        }
      } else if (question.type === 'multiple') {
        const isCorrect =
          userAnswerIds.length === correctAnswerIds.length &&
          userAnswerIds.every((id) => correctAnswerIds.includes(id));

        if (isCorrect) {
          score += 1;
        }
      } else if (
        question.type === 'short_answer' &&
        question.answerText !== undefined
      ) {
        const userAnswerText = userAnswer?.answer[0].answer || '';
        if (
          userAnswerText.trim().toLowerCase() ===
          question.answerText.trim().toLowerCase()
        ) {
          score += 1;
        }
      }
    });

    return score;
  };

  const handleSubmit = async () => {
    const unansweredQuestions = questions.filter(
      (q) => !isQuestionAnswered(q._id)
    );

    if (unansweredQuestions.length > 0) {
      setShowDialog(true);
      return;
    }

    const answersForBackend = userAnswers.map((ua) => ({
      quizQuestionId: ua.quizQuestionId,
      answer: ua.answer.map((a) => a.answer)
    }));

    try {
      await submitQuizAttempt.mutateAsync({
        quizTestId: data.quizTest._id,
        answers: answersForBackend
      });

      dispatch(setShowResults(true));
    } catch {
      toast.error('Failed to submit answers');
    }
  };

  const handleRetry = async () => {
    dispatch(clearAnswers());
    dispatch(setShowResults(false));
    router.push(`/apps/resources/quizzes/prepare/${data.quizTest._id}`);
  };

  const answeredQuestionsCount = Object.keys(userAnswers).length;
  const progressPercentage = (answeredQuestionsCount / questions.length) * 100;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;

  if (showResults) {
    const score = calculateScore();
    return (
      <QuizStudyResults
        score={score}
        totalQuestions={questions.length}
        handleRetry={handleRetry}
      />
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <QuizStudyProgress progressPercentage={progressPercentage} />
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {questions.map((question) => (
              <QuizStudyQuestion
                key={question._id}
                question={question}
                userAnswers={userAnswers}
                handleAnswerChange={handleAnswerChange}
                handleShortAnswerChange={handleShortAnswerChange}
              />
            ))}
          </ScrollArea>
          <QuizStudySubmitButton handleSubmit={handleSubmit} />
        </div>
        <QuestionStatus
          isQuestionAnswered={isQuestionAnswered}
          questions={questions}
        />
      </div>
      <AnimatePresence>
        {showDialog && (
          <ConfirmDialog
            setShowDialog={setShowDialog}
            showDialog={showDialog}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizStudyPage;
