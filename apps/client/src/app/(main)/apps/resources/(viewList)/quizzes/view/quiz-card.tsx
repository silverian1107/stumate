import { PenLine, PlayIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuizById } from '@/hooks/use-quiz';

interface ResourceCardProps {
  id?: string;
  name: string;
  description?: string;
}

const QuizCard = ({ id, name, description }: ResourceCardProps) => {
  const { data, isLoading, error } = useQuizById(id);

  if (isLoading || error || !data) return null;

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
        <h1 className="-mb-1 text-xl font-bold">
          {name}{' '}
          <span className="text-lg font-semibold text-primary-600 ">Alo</span>
        </h1>
        <h2 className="line-clamp-1 text-sm font-medium text-primary-950/50">
          {description}
        </h2>
      </div>
      <div className="text-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Last studied: </p>
          <h1>2 days ago</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-950/50">Due today: </p>
          <h1>25</h1>
        </div>
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
        <Button variant="default" className="px-6">
          <PlayIcon /> Study
        </Button>
      </div>
    </div>
  );
};

export default QuizCard;
