import React, { forwardRef } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Question } from '@/redux/slices/quizSlice';

interface PreviewProps {
  questions: Question[];
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(
  ({ questions }, ref) => {
    return (
      <section
        ref={ref}
        className="bg-white rounded-lg shadow-md h-full overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Quiz Preview</h2>
          {questions.map((question, index) => (
            <div key={question._id} className="mb-8">
              <h3 className="text-lg font-semibold mb-3">
                {index + 1}. {question.text}
              </h3>
              {question.type === 'single' ? (
                <RadioGroup>
                  {question.answers
                    ?.filter((answer) => answer.text.trim() !== '')
                    .map((answer) => (
                      <div
                        key={answer._id}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <RadioGroupItem
                          value={answer._id}
                          id={`preview-answer-${answer._id}`}
                          checked={answer.isCorrect}
                          disabled
                        />
                        <Label htmlFor={`preview-answer-${answer._id}`}>
                          {answer.text}
                        </Label>
                      </div>
                    ))}
                </RadioGroup>
              ) : question.type === 'multiple' ? (
                question.answers
                  ?.filter((answer) => answer.text.trim() !== '')
                  .map((answer) => (
                    <div
                      key={answer._id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Checkbox
                        id={`preview-answer-${answer._id}`}
                        checked={answer.isCorrect}
                        disabled
                      />
                      <Label htmlFor={`preview-answer-${answer._id}`}>
                        {answer.text}
                      </Label>
                    </div>
                  ))
              ) : (
                <div className="mb-2">
                  <p className="pl-6 mt-1 block w-full">
                    {question.answerText || ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }
);

Preview.displayName = 'Preview';

export default Preview;
