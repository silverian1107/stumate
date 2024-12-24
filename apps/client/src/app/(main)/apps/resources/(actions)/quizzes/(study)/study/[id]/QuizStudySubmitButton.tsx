import { Button } from '@/components/ui/button';

interface QuizStudySubmitButtonProps {
  handleSubmit: () => void;
}

const QuizStudySubmitButton: React.FC<QuizStudySubmitButtonProps> = ({
  handleSubmit
}) => {
  return (
    <Button onClick={handleSubmit} className="w-full mt-6">
      Submit Quiz
    </Button>
  );
};

export default QuizStudySubmitButton;
