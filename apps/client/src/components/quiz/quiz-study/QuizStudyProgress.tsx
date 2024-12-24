import { Progress } from '@/components/ui/progress';

interface QuizStudyProgressProps {
  progressPercentage: number;
}

const QuizStudyProgress: React.FC<QuizStudyProgressProps> = ({
  progressPercentage
}) => {
  return <Progress value={progressPercentage} className="w-full mb-4" />;
};

export default QuizStudyProgress;
