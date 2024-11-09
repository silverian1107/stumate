import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PenLine, PlayIcon } from 'lucide-react';

interface ResourceCardProps {
  name: string;
  description: string;
}

const ResourceCard = ({ name, description }: ResourceCardProps) => {
  return (
    <div className="w-full bg-white rounded-sm px-4 py-3 flex flex-col text-base gap-3 justify-between">
      <div className="w-full flex items-center justify-end gap-1">
        <div className="bg-primary-100 text-primary-400 px-3 font-bold text-xs py-1 rounded-md">
          Mathematics
        </div>
        <div className="bg-primary-100 text-primary-400 px-3 font-bold text-xs py-1 rounded-md">
          Algorithm
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold -mb-1">
          {name}{' '}
          <span className="font-semibold text-lg text-primary-600 ">
            (45 cards)
          </span>
        </h1>
        <h2 className="text-primary-950/50 font-semibold line-clamp-1">
          {description}
        </h2>
      </div>
      <div className="text-sm">
        <div className="flex justify-between items-center">
          <p className="text-primary-950/50 font-semibold">Last studied: </p>
          <h1>2 days ago</h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-primary-950/50 font-semibold">Due today: </p>
          <h1>25</h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-primary-950/50 font-semibold">Progress: </p>
          <h1>75%</h1>
        </div>
      </div>
      <Progress value={75} />
      <div className="w-full flex justify-end gap-2">
        <Button variant="secondary" className="px-4 hover:bg-primary-100/80">
          <PenLine /> Edit
        </Button>
        <Button variant="default" className="px-6">
          <PlayIcon /> Study
        </Button>
      </div>
    </div>
  );
};

export default ResourceCard;
