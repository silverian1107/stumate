'use client';

import { useParams } from 'next/navigation';

import { useNoteById } from '@/hooks/use-note';

import NoteTitle from '../_components/note-title';
import MyTextEditor from './my-text-editor';

const MyEditor = () => {
  const { id } = useParams();
  const noteId = id as string;
  const { data, isLoading } = useNoteById(noteId);

  if (isLoading) return null;
  console.log(data);

  return (
    <div className="size-full p-5 rounded-sm box-border flex-1 mx-auto overflow-auto pt-20">
      <NoteTitle />
      <div className="mb-5" />
      <MyTextEditor data={data} />
    </div>
  );
};

export default MyEditor;
