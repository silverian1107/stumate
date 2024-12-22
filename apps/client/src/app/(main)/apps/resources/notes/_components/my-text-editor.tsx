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
        readOnly: data.isArchived,
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
  }, [data._id, data.isArchived, initialData, updateNoteMutate]);

  useEffect(() => {
    if (ref.current && ref.current.readOnly) {
      ref.current.readOnly.toggle(data.isArchived);
    }
  }, [data.isArchived]);

  return <div id="editor-js" className="h-fit" />;
};

export default MyTextEditor;
