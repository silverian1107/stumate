'use client';

import { useNoteById } from '@/hooks/use-note';

import NoteTitle from './note-title';

const MyMenuBar = () => {
  const { data, isLoading } = useNoteById();

  if (isLoading || !data) return null;

  return (
    <div className="w-full px-8 flex">
      <NoteTitle isMenuBar />
    </div>
  );
};

export default MyMenuBar;
