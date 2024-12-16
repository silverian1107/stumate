'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import type { Tag } from '@/service/rootApi';
import { useDeleteTagMutation, useRenameTagMutation } from '@/service/rootApi';

import HeaderTag from './Header';

const UserTags = ({ userTags }: { userTags: Tag[] }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagDetails, setTagDetails] = useState<Tag | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTagName, setEditedTagName] = useState('');

  const [deleteTag, { isSuccess: isDeleteSuccess }] = useDeleteTagMutation();
  const [renameTag, { isSuccess: isUpdateSuccess, isError }] =
    useRenameTagMutation();

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
      if (isDeleteSuccess) {
        toast.success('Tag removed successfully!');
      }
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.'
      });
    }
  };

  const handleDetailClick = (tag: Tag) => {
    setTagDetails(tag);
    setEditedTagName(tag.name);
    setSelectedTag(null);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = async () => {
    if (tagDetails) {
      try {
        await renameTag({ id: tagDetails._id, name: editedTagName });
        if (isUpdateSuccess) {
          console.log('succes');
          toast.success('Tag updated successfully!');
          setTagDetails((prev) =>
            prev ? { ...prev, name: editedTagName } : null
          );
          setIsEditing(false);
        }
        if (isError) {
          toast.error('name must be longer than or equal to 1 characters');
        }
      } catch (err) {
        toast.error(`${err}`, {
          description: 'Failed to update tag. Please try again.'
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTagName(tagDetails?.name || '');
  };

  return (
    <div className="flex flex-col gap-4 ">
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
                <span className="font-medium">{tag.name} </span>
                <button
                  onClick={() => toggleDropdown(tag._id)}
                  className="text-gray-500 hover:text-blue-500 transition-all duration-150"
                  type="button"
                >
                  •••
                </button>
                {selectedTag === tag._id && (
                  <ul className="absolute right-4 top-5 mt-2 bg-white border rounded-lg shadow-md text-sm z-10">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => handleDetailClick(tag)}
                      >
                        Detail
                      </button>
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

      {tagDetails && (
        <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-primary-500">
              Tag Details
            </h2>
            <div className="space-y-4 border p-2 border-primary-100">
              <div className="flex gap-1">
                <label className="font-medium text-md text-primary-950">
                  Tag Name:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTagName}
                    onChange={(e) => setEditedTagName(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p>{tagDetails.name}</p>
                )}
              </div>
              <p>
                <span className="font-medium text-primary-950">Creator:</span>{' '}
                {tagDetails.createdBy.username}
              </p>
              <p>
                <span className="font-medium text-primary-950">
                  Created At:
                </span>{' '}
                {new Date(tagDetails.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium text-primary-950">
                  Updated At:
                </span>{' '}
                {new Date(tagDetails.updatedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    type="button"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    type="button"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  type="button"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => {
                  setTagDetails(null);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTags;
