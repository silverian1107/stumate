import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { QuizAnswer, QuizQuestion } from '@/endpoints/quiz/type';
import { useQuizQuestions } from '@/hooks/quiz/use-quiz';
import {
  addQuestion,
  type Answer,
  clearQuestions,
  type Question
} from '@/redux/slices/quizSlice';
import type { RootState } from '@/redux/store';

import Preview from './Preview';
import QuestionForm from './QuestionForm';

export function mapQuizBackendToFrontend(
  backendQuestions: QuizQuestion[]
): Question[] {
  return backendQuestions.map((backendQuestion) => {
    const mappedQuestion: Question = {
      _id: backendQuestion._id ?? uuidv4(),
      text: backendQuestion.question,
      type: backendQuestion.questionType as
        | 'single'
        | 'multiple'
        | 'short_answer',
      answers:
        backendQuestion.questionType !== 'short_answer'
          ? (backendQuestion.answerOptions?.map((answerOption: QuizAnswer) => ({
              _id: answerOption._id ?? uuidv4(),
              text: answerOption.option,
              isCorrect: answerOption.isCorrect
            })) as Answer[])
          : [],
      answerText:
        backendQuestion.questionType === 'short_answer'
          ? backendQuestion.answerText
          : undefined,
      action: 'create',
      originalAction: 'create',
      isDeleted: false
    };

    return mappedQuestion;
  });
}

const QuizCreator: React.FC = () => {
  const { id: routeIds } = useParams<{ id: string }>();
  const { data, isLoading } = useQuizQuestions();
  const dispatch = useDispatch();
  const questions = useSelector((state: RootState) => state.quiz.questions);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const creatorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleScroll = (scrollTop: number, source: 'creator' | 'preview') => {
    setScrollPosition(scrollTop);
    if (source === 'creator' && previewRef.current) {
      previewRef.current.scrollTop = scrollTop;
    } else if (source === 'preview' && creatorRef.current) {
      creatorRef.current.scrollTop = scrollTop;
    }
  };

  useEffect(() => {
    const creatorElement = creatorRef.current;
    const previewElement = previewRef.current;

    if (creatorElement && previewElement) {
      creatorElement.scrollTop = scrollPosition;
      previewElement.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  useEffect(() => {
    if (!routeIds) {
      dispatch(clearQuestions());
    } else if (!isLoading && data) {
      const formattedQuestions = mapQuizBackendToFrontend(data);
      dispatch(clearQuestions());
      formattedQuestions.forEach((question) => {
        dispatch(addQuestion({ ...question, originalAction: 'update' }));
      });
    }
  }, [data, isLoading, dispatch, routeIds]);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
        <div
          ref={creatorRef}
          className="overflow-y-auto pr-4"
          onScroll={(e) => handleScroll(e.currentTarget.scrollTop, 'creator')}
        >
          {questions.map((question) => (
            <QuestionForm key={question._id} question={question} />
          ))}
        </div>
        <div className="hidden lg:block h-full overflow-hidden">
          <Preview questions={questions} ref={previewRef} />
        </div>
      </div>
      <div className="fixed bottom-20 right-4 lg:hidden">
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button>Preview Quiz</Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-[450px] h-[80vh] p-0">
            <Preview questions={questions} ref={previewRef} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuizCreator;
