import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface QuizStudyResultsProps {
  score: number;
  totalQuestions: number;
  handleRetry: () => void;
}

const QuizStudyResults: React.FC<QuizStudyResultsProps> = ({
  score,
  totalQuestions,
  handleRetry
}) => {
  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.p
              className="text-2xl font-bold mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            >
              Your Score: {score} / {totalQuestions}
            </motion.p>
            <p className="mb-4">
              You answered {score} out of {totalQuestions} questions correctly.
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Progress
                value={(score / totalQuestions) * 100}
                className="w-full"
              />
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleRetry}>Try Again</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuizStudyResults;
