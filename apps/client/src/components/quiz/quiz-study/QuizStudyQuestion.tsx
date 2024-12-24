import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Answer {
  _id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  text: string;
  type: 'single' | 'multiple' | 'short_answer';
  answers: Answer[];
  answerText?: string;
}

interface UserAnswer {
  quizQuestionId: string;
  answer: {
    _id?: string;
    answer: string;
  }[];
}

interface QuizStudyQuestionProps {
  question: Question;
  userAnswers: UserAnswer[];
  handleAnswerChange: (questionId: string, answerId: string) => void;
  handleShortAnswerChange: (questionId: string, answerText: string) => void;
}

const QuizStudyQuestion: React.FC<QuizStudyQuestionProps> = ({
  question,
  userAnswers,
  handleAnswerChange,
  handleShortAnswerChange
}) => {
  return (
    <Card key={question._id} className="w-full mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Question</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
        {question.type === 'single' ? (
          <RadioGroup
            value={
              userAnswers.find((ua) => ua.quizQuestionId === question._id)
                ?.answer[0]?._id || ''
            }
            onValueChange={(value) => handleAnswerChange(question._id, value)}
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
        ) : question.type === 'multiple' ? (
          question.answers.map((answer) => (
            <div key={answer._id} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={`${question._id}-${answer._id}`}
                checked={
                  userAnswers
                    .find((ua) => ua.quizQuestionId === question._id)
                    ?.answer.some((a) => a._id === answer._id) || false
                }
                onCheckedChange={() =>
                  handleAnswerChange(question._id, answer._id)
                }
              />
              <Label htmlFor={`${question._id}-${answer._id}`}>
                {answer.text}
              </Label>
            </div>
          ))
        ) : (
          <Input
            type="text"
            value={
              userAnswers.find((ua) => ua.quizQuestionId === question._id)
                ?.answer[0]?.answer || ''
            }
            onChange={(e) =>
              handleShortAnswerChange(question._id, e.target.value)
            }
            placeholder="Type your answer here"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QuizStudyQuestion;
