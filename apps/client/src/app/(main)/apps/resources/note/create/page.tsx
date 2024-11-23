'use client';

import type { OutputData } from '@editorjs/editorjs';
import type EditorJS from '@editorjs/editorjs';
import { useRef, useState } from 'react';

import Editor from './Editor';

const CreateNote = () => {
  const editorRef = useRef<EditorJS | null>(null); // Ref to hold the EditorJS instance
  const [content, setContent] = useState<OutputData | null>(null); // State to hold saved content

  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        setContent(savedData);
      } catch (error) {
        console.error('Failed to save editor data:', error);
      }
    }
  };

  return (
    <div className="flex items-start h-screen">
      <div className="flex flex-col flex-1 gap-5 p-10 ">
        <div className="w-full  p-5 border rounded-sm border-zinc-400">
          <Editor ref={editorRef} />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="border w-fit bg-primary-400 text-white border-zinc-500 px-5 py-2 rounded-lg"
            onClick={handleSave}
          >
            Cancel
          </button>
          <button
            type="button"
            className="border w-fit bg-primary-400 text-white border-zinc-500 px-5 py-2 rounded-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      <pre className="flex-1 h-full p-5 overflow-y-auto bg-gray-100">
        {content ? JSON.stringify(content.blocks, null, 2) : 'No content yet'}
      </pre>
    </div>
  );
};

export default CreateNote;
