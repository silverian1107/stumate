'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuizById, useQuizQuestions } from '@/hooks/use-quiz';
import {
  clearAnswers,
  setQuestions,
  setShowResults,
  setUserAnswer
} from '@/redux/slices/studyQuizSlice';
import type { AppDispatch, RootState } from '@/redux/store';

import { mapQuizBackendToFrontend } from '../../_components/QuizCreator';
import ConfirmDialog from '../_components/confirm-dialog';
import QuestionStatus from '../_components/question-status';

export default function QuizStudyPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuizById(id);
  const {
    data: quizQuestion,
    isLoading: isLoadingQuestion,
    error
  } = useQuizQuestions(id);
  const dispatch = useDispatch<AppDispatch>();
  const { questions, userAnswers, showResults } = useSelector(
    (state: RootState) => state.quizStudy
  );
  const [showDialog, setShowDialog] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (!isLoading && quizQuestion) {
      const mappedQuestions = mapQuizBackendToFrontend(quizQuestion);
      dispatch(setQuestions(mappedQuestions));
    }
  }, [quizQuestion, isLoading, dispatch]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    dispatch(clearAnswers());
    dispatch(setShowResults(false));
  };

  const handleAnswerChange = (questionId: string, answerId: string) => {
    dispatch(setUserAnswer({ questionId, answerId }));
  };

  const isQuestionAnswered = (questionId: string) => {
    return userAnswers[questionId] && userAnswers[questionId].length > 0;
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question) => {
      const userAnswerIds = userAnswers[question._id] || [];
      const correctAnswerIds = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a._id);

      if (question.type === 'single') {
        if (userAnswerIds[0] === correctAnswerIds[0]) {
          score += 1;
        }
      } else {
        const isCorrect =
          userAnswerIds.length === correctAnswerIds.length &&
          userAnswerIds.every((idx) => correctAnswerIds.includes(idx));
        if (isCorrect) {
          score += 1;
        }
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const unansweredQuestions = questions.filter(
      (q) => !isQuestionAnswered(q._id)
    );
    if (unansweredQuestions.length > 0) {
      setShowDialog(true);
    } else {
      dispatch(setShowResults(true));
    }
  };

  const handleRetry = () => {
    dispatch(clearAnswers());
    dispatch(setShowResults(false));
  };

  const answeredQuestionsCount = Object.keys(userAnswers).length;
  const progressPercentage = (answeredQuestionsCount / questions.length) * 100;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;

  if (!quizStarted) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">{data?.name}</h2>
            <p className="mb-4">{data?.description}</p>
            <p className="mb-4">Question: {data?.numberOfQuestion}</p>
            <p className="mb-4">Duration: {data?.duration} minutes</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartQuiz} className="w-full">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p
                className="text-2xl font-bold mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
              >
                Your Score: {score} / {questions.length}
              </motion.p>
              <p className="mb-4">
                You answered {score} out of {questions.length} questions
                correctly.
              </p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Progress
                  value={(score / questions.length) * 100}
                  className="w-full"
                />
              </motion.div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRetry}>Try Again</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (isLoadingQuestion) return <p>Loading...</p>;

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Progress value={progressPercentage} className="w-full mb-4" />
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {questions.map((question, index) => (
              <Card key={question._id} className="w-full mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Question {index + 1}</CardTitle>
                  <Badge className="hover:bg-primary-main cursor-default">
                    1 point
                  </Badge>
                </CardHeader>
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4">
                    {question.text}
                  </h2>
                  {question.type === 'single' ? (
                    <RadioGroup
                      value={userAnswers[question._id]?.[0] || ''}
                      onValueChange={(value) =>
                        handleAnswerChange(question._id, value)
                      }
                    >
                      {question.answers.map((answer) => (
                        <div
                          key={answer._id}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <RadioGroupItem
                            value={answer._id}
                            id={`${question._id}-${answer._id}`}
                          />
                          <Label htmlFor={`${question._id}-${answer._id}`}>
                            {answer.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    question.answers.map((answer) => (
                      <div
                        key={answer._id}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Checkbox
                          id={`${question._id}-${answer._id}`}
                          checked={userAnswers[question._id]?.includes(
                            answer._id
                          )}
                          onCheckedChange={() =>
                            handleAnswerChange(question._id, answer._id)
                          }
                        />
                        <Label htmlFor={`${question._id}-${answer._id}`}>
                          {answer.text}
                        </Label>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          <Button onClick={handleSubmit} className="w-full mt-6">
            Submit Quiz
          </Button>
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
}
