import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Answer, Question } from '@/redux/slices/quizSlice';
import { updateQuestion } from '@/redux/slices/quizSlice';

interface AnswerOptionsProps {
  question: Question;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({ question }) => {
  const dispatch = useDispatch();
  const [removedAnswers, setRemovedAnswers] = useState<Answer[]>([]);

  const addAnswer = () => {
    const newAnswer: Answer = { _id: uuidv4(), text: '', isCorrect: false };
    dispatch(
      updateQuestion({
        ...question,
        answers: [...question.answers, newAnswer]
      })
    );
  };

  const updateAnswer = (id: string, text: string) => {
    const updatedAnswers = question.answers.map((answer) =>
      answer._id === id ? { ...answer, text } : answer
    );
    dispatch(updateQuestion({ ...question, answers: updatedAnswers }));
  };

  const toggleCorrectAnswer = (id: string) => {
    const updatedAnswers = question.answers.map((answer) =>
      answer._id === id
        ? { ...answer, isCorrect: !answer.isCorrect }
        : question.type === 'single'
          ? { ...answer, isCorrect: false }
          : answer
    );
    dispatch(updateQuestion({ ...question, answers: updatedAnswers }));
  };

  const removeAnswer = (id: string) => {
    const updatedAnswers = question.answers.filter(
      (answer) => answer._id !== id
    );
    dispatch(updateQuestion({ ...question, answers: updatedAnswers }));
  };

  const removeAllAnswers = () => {
    setRemovedAnswers(question.answers);
    dispatch(updateQuestion({ ...question, answers: [] }));
  };

  const restoreAnswers = () => {
    dispatch(updateQuestion({ ...question, answers: removedAnswers }));
    setRemovedAnswers([]);
  };

  return (
    <div>
      {question.answers.map((answer) => (
        <div key={answer._id} className="flex items-center space-x-2 mb-2">
          {question.type === 'single' ? (
            <RadioGroup
              value={answer.isCorrect ? answer._id : ''}
              onValueChange={() => toggleCorrectAnswer(answer._id)}
            >
              <RadioGroupItem value={answer._id} id={`correct-${answer._id}`} />
            </RadioGroup>
          ) : (
            <Checkbox
              checked={answer.isCorrect}
              onCheckedChange={() => toggleCorrectAnswer(answer._id)}
              id={`correct-${answer._id}`}
            />
          )}
          <Input
            value={answer.text}
            onChange={(e) => updateAnswer(answer._id, e.target.value)}
            placeholder="Enter answer text"
            className="grow"
          />
          <Button
            onClick={() => removeAnswer(answer._id)}
            variant="destructive"
            size="icon"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <div className="flex gap-2 mt-4">
        {question.answers.length > 0 ? (
          <Button
            onClick={removeAllAnswers}
            variant="destructive"
            size="lg"
            className="px-4"
          >
            Remove all answers
          </Button>
        ) : (
          <Button
            onClick={restoreAnswers}
            variant="secondary"
            size="lg"
            disabled={removedAnswers.length === 0}
          >
            <RotateCcw className="size-4" />
            Restore
          </Button>
        )}
        <Button
          onClick={addAnswer}
          variant="outline"
          size="lg"
          className="grow mr-2 border-dashed border-2 border-primary-800 hover:bg-primary-50/50"
        >
          <Plus className="size-6 text-primary-800" />
        </Button>
      </div>
    </div>
  );
};

export default AnswerOptions;
