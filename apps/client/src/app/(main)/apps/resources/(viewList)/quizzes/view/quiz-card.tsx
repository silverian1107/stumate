import { PenLine, PlayIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuizById, useQuizQuestions } from '@/hooks/quiz/use-quiz';

interface ResourceCardProps {
  id?: string;
  name: string;
  description?: string;
}

const QuizCard = ({ id, name, description }: ResourceCardProps) => {
  const { data, isLoading, error } = useQuizById(id);
  const { data: questions, isLoading: isLoadingQuestions } =
    useQuizQuestions(id);

  if (isLoading || isLoadingQuestions || error || !data) return null;

  return (
    <div className="flex w-full flex-col justify-between gap-3 rounded-sm bg-white px-4 py-3 text-base">
      <div className="flex w-full items-center justify-end gap-1">
        <div className="rounded-md bg-primary-100 px-3 py-1 text-xs font-bold text-primary-400">
          Mathematics
        </div>
        <div className="rounded-md bg-primary-100 px-3 py-1 text-xs font-bold text-primary-400">
          Algorithm
        </div>
      </div>
      <div className="text-sm">
        <h1 className="-mb-1 text-xl font-bold line-clamp-2">
          {name}{' '}
          <span className="font-semibold text-primary-600 text-lg">
            {data.duration}m
          </span>
        </h1>
        <h2 className="line-clamp-1 text-sm font-medium text-primary-950/50">
          {description}
        </h2>
      </div>
      <div className="text-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Total questions: </p>
          <h1>{data.numberOfQuestion}</h1>
        </div>
        {/* <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Due today: </p>
          <h1>25</h1>
        </div> */}
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Progress: </p>
          <h1>75%</h1>
        </div>
      </div>
      <Progress value={75} />
      <div className="flex w-full justify-end gap-2">
        <Link href={`/apps/resources/quizzes/edit/${id}`}>
          <Button variant="secondary" className="px-4 hover:bg-primary-100/80">
            <PenLine /> Edit
          </Button>
        </Link>
        <Link href={`/apps/resources/quizzes/prepare/${id}`}>
          <Button
            variant="default"
            className="px-6"
            disabled={questions?.length === 0}
          >
            <PlayIcon /> {questions?.length === 0 ? 'No questions' : 'Study'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;
