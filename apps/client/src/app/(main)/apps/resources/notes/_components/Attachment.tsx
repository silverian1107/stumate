/* eslint-disable simple-import-sort/imports */

'use client';

import {
  useDeleteFileMutation,
  useUploadFilesMutation
} from '@/service/rootApi';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Note } from '@/types/note';

const Attachment = ({ data }: { data: Note }) => {
  const [uploadFiles] = useUploadFilesMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const uploadedFilesRef = useRef<File[]>(uploadedFiles);

  useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);

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

  return (
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
            <p className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
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
  );
};

export default Attachment;
