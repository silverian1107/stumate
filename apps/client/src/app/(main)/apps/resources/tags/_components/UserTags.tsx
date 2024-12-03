/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable simple-import-sort/imports */

'use client';

import { Tag, useDeleteTagMutation } from '@/service/rootApi';
import { useState } from 'react';
import HeaderTag from './Header';
import { toast } from 'sonner';

const UserTags = ({ userTags }: { userTags: Tag[] }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [deleteTag, { isSuccess }] = useDeleteTagMutation();

  const toggleDropdown = (tagId: string) => {
    setSelectedTag(selectedTag === tagId ? null : tagId);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await deleteTag(id);
      if (isSuccess) {
        toast.success('Tag removed successfully!');
      }
    } catch (error) {
      toast.error('Failed to remove file', {
        description: 'Please try again.'
      });
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <HeaderTag headerText="Private Tags" />

      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleFilterChange}
          placeholder="Search private tags..."
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-auto h-[calc(50vh-11rem)] p-2 border rounded-md bg-gray-50 shadow-sm">
        {userTags.length > 0 ? (
          userTags
            .filter((tag) => tag.name.toLowerCase().includes(searchTerm))
            .map((tag) => (
              <div
                key={tag._id}
                className="flex justify-between items-center px-4 py-2 border-b hover:bg-gray-200 rounded-md transition-all duration-150 relative"
              >
                <span className="font-medium">{tag.name}</span>
                <button
                  onClick={() => toggleDropdown(tag._id)}
                  className="text-gray-500 hover:text-blue-500 transition-all duration-150"
                  type="button"
                >
                  •••
                </button>
                {selectedTag === tag._id && (
                  <ul className="absolute right-4 top-full mt-2 bg-white border rounded-lg shadow-md text-sm z-10">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Rename
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      View tag usage
                    </li>
                    <li className="px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer">
                      <button
                        onClick={() => handleDeleteTag(tag._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ))
        ) : (
          <p className="text-center text-gray-500">No tags found.</p>
        )}
      </div>
    </div>
  );
};

export default UserTags;
