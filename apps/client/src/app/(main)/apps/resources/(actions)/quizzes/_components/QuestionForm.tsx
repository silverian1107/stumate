import { XIcon } from 'lucide-react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  markQuestionDeleted,
  type Question,
  restoreQuestion,
  updateQuestion
} from '@/redux/slices/quizSlice';

import AnswerOptions from './AnswerOptions';

interface QuestionFormProps {
  question: Question;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question }) => {
  const dispatch = useDispatch();

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateQuestion({ ...question, text: e.target.value }));
  };

  const handleTypeChange = (value: 'single' | 'multiple') => {
    dispatch(
      updateQuestion({
        ...question,
        type: value,
        answers: question.answers.map((answer) => ({
          ...answer,
          isCorrect: false
        }))
      })
    );
  };

  const handleDelete = () => {
    dispatch(markQuestionDeleted(question.id));
  };

  const handleRestore = () => {
    dispatch(restoreQuestion(question.id));
  };

  if (question.isDeleted) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-500 italic">Question Deleted</h3>
          <Button variant="secondary" onClick={handleRestore}>
            Restore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between mb-3">
        <div className="inline-flex rounded-md shadow-sm gap-1" role="group">
          <Button
            variant={question.type === 'single' ? 'secondary' : 'ghost'}
            className="rounded-l-md"
            onClick={() => handleTypeChange('single')}
          >
            Single Choice
          </Button>
          <Button
            variant={question.type === 'multiple' ? 'secondary' : 'ghost'}
            className="rounded-r-md"
            onClick={() => handleTypeChange('multiple')}
          >
            Multiple Choice
          </Button>
        </div>
        <div>
          <Button variant="ghost" onClick={handleDelete}>
            <XIcon className="size-4" />
            Remove
          </Button>
        </div>
      </div>
      <Textarea
        value={question.text}
        onChange={handleQuestionChange}
        placeholder="Enter question text"
        className="mb-4"
        rows={3}
      />
      <AnswerOptions question={question} />
    </div>
  );
};

export default QuestionForm;
