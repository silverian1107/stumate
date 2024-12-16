import { BrainCircuit, Plus } from 'lucide-react';
import React from 'react';

import {
  useQuizByNoteId,
  useQuizCreate,
  useQuizQuestionsByAi
} from '@/hooks/quiz/use-quiz';
import { useNoteById } from '@/hooks/use-note';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const QuizTabContent = () => {
  const { data: note, isLoading: isLoadingNote } = useNoteById();
  const { data: quiz, isLoading, error } = useQuizByNoteId();

  const createQuiz = useQuizCreate();
  const createQuizQuestion = useQuizQuestionsByAi();

  const handleCreateQuiz = async () => {
    await createQuiz.mutateAsync({
      name: `${note.name}'s Quiz`,
      numberOfQuestion: 99,
      duration: 180,
      noteId: note._id
    });
  };

  const handleCreateQuizByAI = async () => {
    const data = await createQuiz.mutateAsync({
      name: `${note.name}'s Quiz`,
      numberOfQuestion: 99,
      duration: 180,
      noteId: note._id
    });

    await createQuizQuestion.mutateAsync(data._id);
  };

  if (isLoading || isLoadingNote) {
    return (
      <Card>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>Error fetching deck: {error.message}</CardContent>
      </Card>
    );
  }

  const hasQuiz = !!quiz;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <BrainCircuit className="size-4" />
          Related Quizzes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasQuiz ? (
          <>
            <div>
              <h4 className="font-medium">{quiz.name}</h4>
              <p className="text-sm text-muted-foreground">15 questions</p>
            </div>
            <Button className="w-full">Take Quiz</Button>
          </>
        ) : (
          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="sm" onClick={handleCreateQuiz}>
              <Plus className="size-4 mr-2" />
              Create Quiz
            </Button>
            <Button variant="outline" size="sm" onClick={handleCreateQuizByAI}>
              <Plus className="size-4 mr-2" />
              Generate By AI
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizTabContent;
