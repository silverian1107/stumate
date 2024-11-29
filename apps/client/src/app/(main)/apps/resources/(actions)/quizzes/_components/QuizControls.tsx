import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { addQuestion, removeAllQuestions } from '@/redux/slices/quizSlice';

const QuizControls: React.FC = () => {
  const dispatch = useDispatch();

  const handleAddQuestion = () => {
    dispatch(
      addQuestion({
        id: uuidv4(),
        text: '',
        type: 'single',
        answers: Array(4)
          .fill(null)
          .map(() => ({ id: uuidv4(), text: '', isCorrect: false }))
      })
    );
  };

  const handleRemoveAllQuestions = () => {
    dispatch(removeAllQuestions());
  };

  return (
    <div className="flex justify-end items-center space-x-2 pt-2">
      <Button onClick={handleRemoveAllQuestions} variant="destructive">
        <Trash2 className="size-4 mr-2" /> Remove All
      </Button>
      <Button onClick={handleAddQuestion} variant="default">
        <Plus className="size-4 mr-2" /> Add Question
      </Button>
    </div>
  );
};
export default QuizControls;
