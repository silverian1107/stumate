import React from 'react';

import { useNoteById, useRestoreNote } from '@/hooks/use-note';

const NoteStatusBar = () => {
  const { data: noteData, isLoading } = useNoteById();
  const restoreNotes = useRestoreNote();
  const handleRestore = () => {
    if (noteData?._id) {
      restoreNotes.mutate(noteData._id);
    }
  };

  const handleDelete = () => {};

  if (!noteData || isLoading || !noteData.isArchived) return null;

  return (
    <div className="w-full bg-yellow-50 text-yellow-800 py-0.5 px-8 flex items-center justify-between text-xs">
      <span>
        This note is archived. You can restore it or delete it permanently.
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRestore}
          className="px-4 py-0.5 border border-primary-600 text-primary-600 rounded hover:bg-primary-50"
        >
          Restore
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 border border-red-600 text-red-600 rounded hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteStatusBar;
