import { BrainCircuit, Plus, SparkleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import {
  useQuizByNoteId,
  useQuizCreate,
  useQuizQuestionsByAi
} from '@/hooks/quiz/use-quiz';
import { useNoteById } from '@/hooks/use-note';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Spinner } from '../ui/spinner'; // Import the Spinner component

const QuizTabContent = () => {
  const router = useRouter();

  const { data: note, isLoading: isLoadingNote } = useNoteById();
  const { data: quiz, isLoading, error } = useQuizByNoteId();

  const createQuiz = useQuizCreate();
  const createQuizQuestion = useQuizQuestionsByAi();

  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [isGeneratingByAI, setIsGeneratingByAI] = useState(false);

  const handleCreateQuiz = async () => {
    setIsCreatingQuiz(true);
    try {
      await createQuiz.mutateAsync({
        name: `${note.name}'s Quiz`,
        numberOfQuestion: 99,
        duration: 180,
        noteId: note._id
      });
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  const handleCreateQuizByAI = async () => {
    setIsGeneratingByAI(true);
    try {
      const data = await createQuiz.mutateAsync({
        name: `${note.name}'s Quiz`,
        numberOfQuestion: 99,
        duration: 180,
        noteId: note._id
      });

      await createQuizQuestion.mutateAsync(data._id);
    } finally {
      setIsGeneratingByAI(false);
    }
  };

  if (isLoading || isLoadingNote) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>Error fetching quiz: {error.message}</CardContent>
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
              <p className="text-sm text-muted-foreground">
                {quiz.numberOfQuestion} questions
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                className="w-full hover:bg-primary-50/80 bg-primary-50 text-primary-600"
                variant="secondary"
                onClick={() => {
                  router.push(`/apps/resources/quizzes/edit/${quiz._id}`);
                }}
              >
                Edit
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  router.push(`/apps/resources/quizzes/prepare/${quiz._id}`);
                }}
                disabled={isGeneratingByAI}
              >
                {isGeneratingByAI ? (
                  <>
                    <Spinner size="small" />
                    <span className="ml-2">Generating...</span>
                  </>
                ) : (
                  'Take Quiz'
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateQuiz}
              disabled={isCreatingQuiz}
            >
              {isCreatingQuiz ? (
                <Spinner size="small" />
              ) : (
                <Plus className="size-4 mr-2" />
              )}
              Create Quiz
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateQuizByAI}
              disabled={isGeneratingByAI}
            >
              {isGeneratingByAI ? (
                <Spinner size="small" />
              ) : (
                <SparkleIcon className="size-4 mr-2" />
              )}
              Generate By AI
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizTabContent;
