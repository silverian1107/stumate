'use client';

import { useNoteById } from '@/hooks/use-note';

import MyTextEditor from './my-text-editor';
import NoteTitle from './note-title';

const MyEditor = () => {
  const { data, isLoading } = useNoteById();

  if (isLoading || !data) return null;
  // console.log('data', data);

  return (
    <div className="size-full p-5 rounded-sm box-border flex-1 mx-auto overflow-auto pt-20">
      <NoteTitle />
      <div className="mb-5" />
      <MyTextEditor data={data} />
    </div>
  );
};

export default MyEditor;
