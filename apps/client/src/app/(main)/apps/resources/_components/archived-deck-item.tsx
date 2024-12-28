import { Trash2, Undo2 } from 'lucide-react';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ArchivedItemProps {
  name: string;
  description: string;
  onRestore: () => void;
  onDelete: () => void;
}

export function ArchivedItem({
  name,
  description,
  onRestore,
  onDelete
}: ArchivedItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-2 py-1 hover:bg-primary-50 rounded-lg transition-colors">
      <div className="grow mr-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex space-x-2">
        <Button
          className="hover:bg-primary-100"
          variant="ghost"
          size="icon"
          onClick={onRestore}
          title="Restore"
        >
          <Undo2 className="size-4 text-primary-600" />
          <span className="sr-only">Restore</span>
        </Button>
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button
              className="hover:bg-red-100"
              variant="ghost"
              size="icon"
              title="Delete"
            >
              <Trash2 className="size-4 text-red-600" />
              <span className="sr-only">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                archived item &quot;{name}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
