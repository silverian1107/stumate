'use client';

import { useEffect, useState } from 'react';

import { useNoteById, useUpdateNote } from '@/hooks/use-note';
import { cn } from '@/lib/utils';

const NoteTitle = ({ isMenuBar }: { isMenuBar?: boolean }) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useNoteById();
  const updateNote = useUpdateNote();

  useEffect(() => {
    if (!data) return;
    setNoteTitle(data.name);
  }, [data]);

  const handleOnBlur = () => {
    setIsEditing(false);
    updateNote.mutate({
      _id: data!._id,
      name: noteTitle
    });
  };

  const handleIsEditing = () => {
    if (data.isArchived) return;
    setIsEditing(true);
  };

  if (isLoading) return null;

  return (
    <>
      {!isEditing && (
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'text-base line-clamp-1 w-1/3 sticky px-2 py-1',
            isMenuBar
              ? 'h-8'
              : 'w-full lg:w-4/5 mx-auto text-xl line-clamp-1 h-10',
            data.isArchived && 'cursor-default'
          )}
          onClick={handleIsEditing}
        >
          {noteTitle}
        </div>
      )}
      {isEditing && (
        <input
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          className={cn(
            'text-base line-clamp-1 w-1/3 sticky px-2 py-1',
            isMenuBar
              ? 'h-8'
              : 'w-full lg:w-4/5 mx-auto text-xl line-clamp-1 h-10'
          )}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onBlur={() => handleOnBlur()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleOnBlur();
          }}
        />
      )}
    </>
  );
};

export default NoteTitle;
