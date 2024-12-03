'use client';

import type { API, OutputData } from '@editorjs/editorjs';
import EditorJS from '@editorjs/editorjs';
import { useEffect, useRef } from 'react';

import { useUpdateNote } from '@/hooks/use-note';
import type { Note } from '@/types/note';

import { tools } from '../../(actions)/_components/tools';

const MyTextEditor = ({ data }: { data: Note }) => {
  let initialData;
  if (!data.body) {
    initialData = {} as OutputData;
  } else {
    initialData = data.body as OutputData;
  }

  const updateNoteMutate = useUpdateNote();
  const ref = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor-js',
        data: initialData,
        autofocus: true,
        tools,
        onChange: async (event: API) => {
          const body = await event.saver.save();
          updateNoteMutate.mutate({
            _id: data._id,
            body
          });
        }
      });
      ref.current = editor;
    }
  }, [data._id, initialData, updateNoteMutate]);

  return <div id="editor-js" className="h-fit overflow-auto border" />;
};

export default MyTextEditor;
