import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { RootState } from '@/redux/store';

import Preview from './Preview';
import QuestionForm from './QuestionForm';

const QuizCreator: React.FC = () => {
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

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
        <div
          ref={creatorRef}
          className="overflow-y-auto pr-4"
          onScroll={(e) => handleScroll(e.currentTarget.scrollTop, 'creator')}
        >
          {questions.map((question) => (
            <QuestionForm key={question.id} question={question} />
          ))}
        </div>
        <div className="hidden lg:block h-full overflow-hidden">
          <Preview
            questions={questions}
            onScroll={(scrollTop) => handleScroll(scrollTop, 'preview')}
            ref={previewRef}
          />
        </div>
      </div>
      <div className="fixed bottom-20 right-4 lg:hidden">
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button>Preview Quiz</Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-[450px] h-[80vh] p-0">
            <Preview
              questions={questions}
              onScroll={(scrollTop) => handleScroll(scrollTop, 'preview')}
              ref={previewRef}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuizCreator;
