'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useQuizById } from '@/hooks/quiz/use-quiz';
import { useStartQuizAttempt } from '@/hooks/quiz/use-quiz-attempt';

export default function QuizPreparePage() {
  const { id: quizId } = useParams<{ id: string }>();
  const { data: quiz, isLoading, error } = useQuizById(quizId);
  const startQuiz = useStartQuizAttempt();
  const router = useRouter();

  const handleStartQuiz = async () => {
    const testAttempt = await startQuiz.mutateAsync();

    if (testAttempt) {
      router.push(
        `/apps/resources/quizzes/study/${testAttempt.quizAttempt._id}`
      );
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">{quiz?.name}</h2>
          <p className="mb-4">{quiz?.description}</p>
          <p className="mb-4">Questions: {quiz?.numberOfQuestion}</p>
          <p className="mb-4">Duration: {quiz?.duration} minutes</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartQuiz} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
