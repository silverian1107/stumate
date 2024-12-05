import { Menu } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Question } from '@/redux/slices/quizSlice';

interface QuestionStatusProps {
  questions: Question[];
  isQuestionAnswered: (questionId: string) => boolean;
}
const QuestionStatus = ({
  questions,
  isQuestionAnswered
}: QuestionStatusProps) => {
  return (
    <div className="fixed bottom-12 right-4 lg:static lg:bottom-auto lg:right-auto">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden bg-primary-200 rounded-full text-primary-800"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[250px] sm:w-[300px]">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Question Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => (
                  <Badge
                    key={question._id}
                    variant={
                      isQuestionAnswered(question._id) ? 'default' : 'outline'
                    }
                  >
                    {index + 1}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </SheetContent>
      </Sheet>
      <Card className="hidden lg:block sticky top-4 w-full max-w-[250px]">
        <CardHeader>
          <CardTitle>Question Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => (
              <Badge
                key={question._id}
                variant={
                  isQuestionAnswered(question._id) ? 'default' : 'outline'
                }
              >
                {index + 1}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionStatus;
