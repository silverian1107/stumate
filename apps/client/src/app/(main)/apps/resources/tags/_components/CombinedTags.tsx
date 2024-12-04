/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable unused-imports/no-unused-imports */

'use client';

import { Tag } from '@/service/rootApi';
import { useState } from 'react';
import HeaderTag from './Header';

const CombinedTags = ({ combinedTags }: { combinedTags: Tag[] }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDropdown = (tagId: string) => {
    setSelectedTag(selectedTag === tagId ? null : tagId);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center px-4 py-2 border-b bg-slate-300 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold">All Tags</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={handleFilterChange}
          placeholder="Search all tags..."
          className="w-2/3 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-auto h-[calc(50vh-11rem)] p-2 border rounded-md bg-gray-50 shadow-sm">
        {combinedTags.length > 0 ? (
          combinedTags
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
                      View users with tag
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      View tag usage
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

export default CombinedTags;
