import { Archive, MoreHorizontal, Share2, Undo2 } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useArchiveNote, useNoteById, useRestoreNote } from '@/hooks/use-note';

import NoteTitle from './note-title';
import ShareDialog from './share-dialog';

// components/menu-bar.tsx
const MyMenuBar = () => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const { data, isLoading } = useNoteById();
  const archiveNote = useArchiveNote();
  const restoreNote = useRestoreNote();

  if (isLoading || !data) return null;

  const handleArchive = () => {
    if (data?._id) archiveNote.mutate(data._id);
  };

  const handleRestore = () => {
    if (data?._id) restoreNote.mutate(data._id);
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  return (
    <>
      <div className="w-full px-8 flex justify-between pr-10 py-1">
        <NoteTitle isMenuBar />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              role="button"
              className="hover:bg-primary-100 cursor-pointer rounded-md p-2"
            >
              <MoreHorizontal className="size-5 text-primary-900/50 hover:text-primary-900/80" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            className="w-48 bg-primary-50"
          >
            {!data.isArchived ? (
              <DropdownMenuItem
                onClick={handleArchive}
                className="hover:bg-primary-100 cursor-pointer"
              >
                <Archive className="size-4 mr-2 text-primary-900/70 " />
                Archive
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleRestore}
                className="hover:bg-primary-100 cursor-pointer"
              >
                <Undo2 className="size-4 mr-2 text-primary-900/70" />
                Restore
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={handleShare}
              className="hover:bg-primary-100 cursor-pointer"
            >
              <Share2 className="size-4 mr-2 text-primary-900/70" />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ShareDialog
        noteId={data._id}
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      />
    </>
  );
};

export default MyMenuBar;
