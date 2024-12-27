import {
  FileTextIcon,
  FolderOpenIcon,
  Trash2Icon,
  Undo2Icon
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog';
import {
  useDeleteCollection,
  useGetArchivedResources,
  useRestoreCollection
} from '@/hooks/use-collection';
import { useDeleteNote, useRestoreNote } from '@/hooks/use-note';
import { cn } from '@/lib/utils';

const ArchivedList = () => {
  const { data, isLoading } = useGetArchivedResources();

  const restoreNotes = useRestoreNote();
  const restoreCollections = useRestoreCollection();
  const deleteNote = useDeleteNote();
  const deleteCollection = useDeleteCollection();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: string | null;
    documentId: string;
    type: string;
  }>({
    open: false,
    action: null,
    documentId: '',
    type: ''
  });

  const openConfirmDialog = (
    action: string,
    documentId: string,
    type: string
  ) => {
    setConfirmDialog({ open: true, action, documentId, type });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, action: null, documentId: '', type: '' });
  };

  const handleAction = () => {
    const { action, documentId, type } = confirmDialog;
    if (action === 'restore') {
      if (type === 'Note') {
        restoreNotes.mutate(documentId);
      } else {
        restoreCollections.mutate(documentId);
      }
    } else if (action === 'delete') {
      if (type === 'Note') {
        deleteNote.mutate(documentId);
      } else {
        deleteCollection.mutate(documentId);
      }
    }
    closeConfirmDialog();
  };

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No archived resources found.
      </div>
    );
  }
  const { data: dataArray } = data;

  return (
    <div className="space-y-2 overflow-auto">
      {dataArray.map((item) => (
        <Link
          href={
            item.type === 'Note' ? `/apps/resources/notes/${item._id}` : '#'
          }
          key={item._id}
          className={cn(
            'flex items-center p-2 rounded-md transition-all hover:bg-primary-100',
            item.type === 'Note' && 'bg-muted-50',
            item.type === 'Collection' && 'bg-muted-100'
          )}
        >
          <div className="ml-3 shrink-0">
            {item.type === 'Note' ? (
              <FileTextIcon className="size-5 text-primary-700" />
            ) : (
              <FolderOpenIcon className="size-5 text-primary-700" />
            )}
          </div>

          <div className="ml-3 grow truncate">
            <span className="text-sm font-medium">{item.name}</span>
            <div className="text-xs text-muted-foreground">
              Archived: {new Date(item.archivedAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            <button
              type="button"
              onClick={() => openConfirmDialog('restore', item._id, item.type)}
              className="text-primary-600 p-1 hover:bg-primary-200/70 rounded"
            >
              <Undo2Icon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => openConfirmDialog('delete', item._id, item.type)}
              className="text-red-600 p-1 hover:bg-red-200/70 rounded"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </Link>
      ))}

      <Dialog open={confirmDialog.open} onOpenChange={closeConfirmDialog}>
        <DialogContent>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to {confirmDialog.action} this{' '}
            {confirmDialog.type.toLowerCase()}?
          </DialogDescription>
          <DialogFooter>
            <button
              type="button"
              onClick={closeConfirmDialog}
              className="text-sm text-muted-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAction}
              className="text-sm text-red-600"
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArchivedList;
