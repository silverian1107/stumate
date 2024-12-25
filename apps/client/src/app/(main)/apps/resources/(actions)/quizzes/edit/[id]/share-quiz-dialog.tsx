import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useQuizById } from '@/hooks/quiz/use-quiz';
import { useShareQuiz, useUnshareQuiz } from '@/hooks/use-share';

const ShareQuizDialog = ({
  quizId,
  isOpen,
  onClose
}: {
  quizId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');

  const { data, isLoading } = useQuizById(quizId);
  const shareQuiz = useShareQuiz();
  const unshareQuiz = useUnshareQuiz();

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim()) return;

    shareQuiz.mutate(
      { quizId, usernameOrEmail },
      {
        onSuccess: () => {
          setUsernameOrEmail('');
          toast.success('Quiz shared successfully');
        },
        onError: () => {
          toast.error('Failed to share quiz');
        }
      }
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleUnshare = (usernameOrEmail: string) => {
    unshareQuiz.mutate(
      { quizId, usernameOrEmail },
      {
        onSuccess: () => {
          toast.success('Access revoked');
        },
        onError: () => {
          toast.error('Failed to revoke access');
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Quiz</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleShare} className="flex gap-2 mt-4">
          <Input
            placeholder="Enter username or email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <Button type="submit" disabled={shareQuiz.isPending}>
            Share
          </Button>
        </form>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Shared with</h4>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-2">
              {data?.sharedWithUsers?.length ? (
                data.sharedWithUsers.map(
                  (user: { email: string; username: string }) => (
                    <div
                      key={user.email}
                      className="flex items-center justify-between p-2 rounded-md bg-secondary/20"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-sm text-primary-950/80">
                          {user.email}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnshare(user.email)}
                        disabled={unshareQuiz.isPending}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        Unshare
                      </Button>
                    </div>
                  )
                )
              ) : (
                <div className="text-sm text-muted-foreground">
                  No users shared yet
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareQuizDialog;
