'use client';

import type { OutputData } from '@editorjs/editorjs';
import type EditorJS from '@editorjs/editorjs';
import { throttle } from 'lodash';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  useDeleteFileMutation,
  useGetNoteByIdQuery,
  useUpdateNoteMutation,
  useUploadFilesMutation
} from '@/service/rootApi';

import Editor from './Editor';

const NoteEditor = ({ noteId }: { noteId: string }) => {
  const [uploadFiles] = useUploadFilesMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [updateNote] = useUpdateNoteMutation();

  const { data, isLoading } = useGetNoteByIdQuery(noteId);

  const editorRef = useRef<EditorJS | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [editorValue, setEditorValue] = useState<OutputData | null>(null);

  const uploadedFilesRef = useRef<File[]>(uploadedFiles);

  useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);

  useEffect(() => {
    if (data?.data?.body) {
      // Set the editor's initial value to the data.body
      setEditorValue({
        time: data.data.body.time,
        blocks: data.data.body.blocks
      });
    } else {
      // Initialize with an empty structure if no data is available
      setEditorValue({
        time: Date.now(),
        blocks: []
      });
    }
  }, [data]);

  const throttledUpdateNote = throttle(async (editorContent: OutputData) => {
    try {
      const fileNames = uploadedFilesRef.current.map((file) => file.name);
      await updateNote({
        name: data?.data.name || 'New Note',
        noteId,
        body: {
          time: editorContent.time as number,
          blocks: editorContent.blocks
        },
        attachment: fileNames
      }).unwrap();
    } catch {
      toast.error('Failed to update note', {
        description: 'Please try again.'
      });
    }
  }, 1000);

  const handleEditorChange = useCallback(async () => {
    if (editorRef.current) {
      const savedData = await editorRef.current.save();
      throttledUpdateNote(savedData);
      setEditorValue(savedData);
    }
  }, [editorRef, throttledUpdateNote, setEditorValue]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      setUploadedFiles([...uploadedFiles, ...Array.from(files)]);

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append(file.name, file);
      });

      try {
        await uploadFiles(formData).unwrap();
        if (editorRef.current) {
          const savedData = await editorRef.current.save();
          throttledUpdateNote(savedData);
        }
      } catch {
        toast.error('Failed to upload files', {
          description: 'Please try again.'
        });
      }
    }
  };

  const handleRemoveFile = async (index: number) => {
    const fileToRemove = uploadedFiles[index];

    try {
      await deleteFile({ fileName: fileToRemove.name }).unwrap();
      setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
      if (editorRef.current) {
        const savedData = await editorRef.current.save();
        throttledUpdateNote(savedData);
      }
      toast('File removed successfully!');
    } catch {
      toast.error('Failed to remove file', {
        description: 'Please try again.'
      });
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.isReady.then(() => {
        // @ts-expect-error Property 'onChange' does not exist
        editorRef.current?.onChange?.(handleEditorChange);
      });
    }
  }, [handleEditorChange]);

  if (isLoading || !editorValue) {
    return <p>Loading...</p>;
  }
  return (
    <div className="h-full w-2/3 flex flex-col gap-5">
      <h3 className="font-bold">{data?.data.name}</h3>
      <div className="w-full h-[450px] p-5 rounded-sm bg-white box-border">
        <Editor
          ref={editorRef}
          onChange={handleEditorChange}
          data={editorValue}
        />
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">
          Attachments ({uploadedFiles.length})
        </p>
        <div className="flex flex-wrap gap-4">
          {/* Add new file button */}
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center size-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
          >
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="text-2xl text-gray-400">+</span>
          </label>

          {/* Display uploaded files */}
          {uploadedFiles.map((file, index) => (
            <div
              key={file.name}
              className="relative flex flex-col items-center size-24 bg-gray-100 rounded-md shadow-md overflow-hidden"
            >
              <div className="w-full h-16 flex justify-center items-center bg-white">
                {file.type.startsWith('image/') ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="object-cover size-full"
                  />
                ) : (
                  <div className="text-2xl text-gray-400">📄</div>
                )}
              </div>
              <div className="flex flex-col items-center text-xs p-2">
                <p className="truncate">{file.name}</p>
                <p className="text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute top-0 right-0 mt-1 mr-1 bg-red-500 text-white text-xs size-4 flex items-center justify-center rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
