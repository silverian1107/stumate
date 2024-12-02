import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  addQuestion,
  removeAllQuestions,
  restoreQuestion
} from '@/redux/slices/quizSlice';
import type { RootState } from '@/redux/store';

const QuizControls: React.FC = () => {
  const dispatch = useDispatch();
  const questions = useSelector((state: RootState) => state.quiz.questions);

  const handleAddQuestion = () => {
    dispatch(
      addQuestion({
        _id: uuidv4(),
        text: '',
        type: 'single',
        answers: Array(4)
          .fill(null)
          .map(() => ({ _id: uuidv4(), text: '', isCorrect: false }))
      })
    );
  };

  const handleRemoveAllQuestions = () => {
    dispatch(removeAllQuestions());
  };

  const handleRestoreDeletedQuestions = () => {
    questions
      .filter((q) => q.isDeleted)
      .forEach((q) => dispatch(restoreQuestion(q._id)));
  };

  return (
    <div className="flex justify-end items-center space-x-2 pt-2">
      <Button onClick={handleRemoveAllQuestions} variant="destructive">
        <Trash2 className="size-4 mr-2" /> Remove All
      </Button>
      <Button onClick={handleRestoreDeletedQuestions} variant="secondary">
        <RotateCcw className="size-4 mr-2" /> Restore Deleted
      </Button>
      <Button onClick={handleAddQuestion} variant="default">
        <Plus className="size-4 mr-2" /> Add Question
      </Button>
    </div>
  );
};

export default QuizControls;
