'use client';

import { Tag } from 'lucide-react';
import { useState } from 'react';

import { useCreateTagMutation } from '@/service/rootApi';

const HeaderTag = ({ headerText }: { headerText: string }) => {
  const [isShowCreate, setIsShowCreate] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [createTag] = useCreateTagMutation();

  const handleToggle = () => {
    setIsShowCreate(!isShowCreate);
  };

  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter') {
      if (newTag.trim() === '') {
        alert('Tag name cannot be empty');
        return;
      }

      try {
        console.log('newtag', newTag);
        createTag({ name: newTag });
        setNewTag('');
        setIsShowCreate(!isShowCreate);
      } catch (error) {
        console.error('Error creating tag:', error);
        alert('An error occurred while creating the tag');
      }
    }
  };

  return (
    <div className="px-4 py-2 border-b h-fit flex justify-between items-center rounded-lg bg-slate-300">
      <h2 className="text-lg font-bold">{headerText}</h2>
      <div className="relative ">
        <button
          className="text-blue-500 hover:underline flex gap-1 items-center hover:border hover:bg-green-300 hover:rounded-md hover:text-white px-2 py-0.5"
          onClick={handleToggle}
          type="button"
        >
          <Tag className="size-4 mr-1" />
          Add new tag
        </button>
        {isShowCreate && (
          <div className="absolute right-0 top-10 bg-white border rounded shadow-lg z-10">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="p-2 border rounded"
              placeholder="Enter tag name"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderTag;
