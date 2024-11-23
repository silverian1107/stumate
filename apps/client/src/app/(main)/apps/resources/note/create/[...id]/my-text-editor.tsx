'use client';

import { useUpdateNote } from '@/hooks/use-note';
import { Note } from '@/types/note';
import EditorJS, { API, OutputData } from '@editorjs/editorjs';
import { useEffect, useRef } from 'react';
import { tools } from '../../../(actions)/_components/tools';

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
        tools: tools,
        onChange: async (event: API) => {
          const body = await event.saver.save();
          updateNoteMutate.mutate({
            _id: data._id,
            body,
          });
        },
      });
      ref.current = editor;
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, [data._id, initialData, updateNoteMutate]);

  return <div id="editor-js" className="h-fit" />;
};

export default MyTextEditor;
