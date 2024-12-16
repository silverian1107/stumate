// components/share-dialog.tsx
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useNoteById } from '@/hooks/use-note';
import { useShareNote, useUnshareNote } from '@/hooks/use-share';

interface ShareDialogProps {
  noteId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ShareDialog = ({ noteId, isOpen, onClose }: ShareDialogProps) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const { data, isLoading } = useNoteById();
  const shareNote = useShareNote();
  const unshareNote = useUnshareNote();

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim()) return;

    shareNote.mutate(
      { resourceId: noteId, usernameOrEmail },
      {
        onSuccess: () => {
          setUsernameOrEmail('');
        }
      }
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleUnshare = (usernameOrEmail: string) => {
    unshareNote.mutate({ resourceId: noteId, usernameOrEmail });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleShare} className="flex gap-2 mt-4">
          <Input
            placeholder="Enter username or email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <Button type="submit" disabled={shareNote.isPending}>
            Share
          </Button>
        </form>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Shared with</h4>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-2">
              {data?.sharedWithUsers?.length > 0 ? (
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
                        disabled={unshareNote.isPending}
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

export default ShareDialog;
