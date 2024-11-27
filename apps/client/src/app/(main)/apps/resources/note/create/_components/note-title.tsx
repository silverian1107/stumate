'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useNoteById, useUpdateNote } from '@/hooks/use-note';

const NoteTitle = () => {
  const { id } = useParams();
  const noteId = id as string;

  const [noteTitle, setNoteTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useNoteById(noteId);
  const updateNote = useUpdateNote();

  useEffect(() => {
    if (!data) return;
    setNoteTitle(data.name);
  }, [data]);

  const handleOnBlur = () => {
    setIsEditing(false);
    updateNote.mutate({
      _id: data._id,
      name: noteTitle
    });
  };

  if (isLoading) return null;
  return (
    <>
      {!isEditing && (
        <div
          role="button"
          tabIndex={0}
          className="w-full lg:w-4/5 mx-auto text-xl line-clamp-1"
          onClick={() => setIsEditing(true)}
        >
          {noteTitle}
        </div>
      )}
      {isEditing && (
        <input
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          className="w-full lg:w-4/5 mx-auto text-xl line-clamp-1 forcus:outline-none"
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
