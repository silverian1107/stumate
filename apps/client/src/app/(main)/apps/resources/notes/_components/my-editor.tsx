/* eslint-disable simple-import-sort/imports */

'use client';

import { useNoteById } from '@/hooks/use-note';

import MyTextEditor from './my-text-editor';
import NoteTitle from './note-title';
// import Attachment from './Attachment';

const MyEditor = () => {
  const { data, isLoading } = useNoteById();

  if (isLoading || !data) return null;

  return (
    <div className="w-full h-[450px] p-5 rounded-sm bg-white box-border">
      <NoteTitle />
      <div className="mb-5 " />
      <MyTextEditor data={data} />
      {/* <Attachment data={data} /> */}
    </div>
  );
};

export default MyEditor;
