'use client';
import { forwardRef, useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { tools } from '../../(actions)/_components/tools';

interface EditorProps {
  data?: OutputData;
}

const Editor = forwardRef<EditorJS | null, EditorProps>(function Editor(
  { data },
  ref,
) {
  const editorRef = useRef<EditorJS | null>(null); // Stores the editor instance
  const isInitialized = useRef(false); // Tracks if the editor has been initialized

  useEffect(() => {
    if (isInitialized.current) return; // Skip initialization if already done
    isInitialized.current = true;

    const editor = new EditorJS({
      holder: 'editor',
      placeholder: 'Type something!',
      autofocus: true,
      tools: tools,
      data: data || undefined,
    });

    editorRef.current = editor;

    if (ref && typeof ref === 'object' && ref !== null) {
      ref.current = editor;
    }

    return () => {
      if (editor && typeof editor.destroy === 'function') {
        editor.destroy(); // Only call destroy if the method exists
      }
    };
  }, [data, ref]);

  return <div id="editor" />;
});

export default Editor;
