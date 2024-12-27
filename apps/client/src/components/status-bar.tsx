import React from 'react';

interface StatusBarProps {
  type: 'Note' | 'Deck' | 'Quiz';
  data: any;
  isLoading: boolean;
  handleRestore: () => void;
  handleDelete: () => void;
}

const StatusBar = ({
  type,
  data,
  isLoading,
  handleRestore,
  handleDelete
}: StatusBarProps) => {
  if (!data || isLoading || !data.isArchived) return null;

  return (
    <div className="w-full bg-yellow-50 text-yellow-800 py-1 px-8 flex items-center justify-between text-xs">
      <span>
        This {type.toLocaleLowerCase()} is archived. You can restore it or
        delete it permanently.
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRestore}
          className="px-4 py-0.5 border border-primary-600 text-primary-600 rounded hover:bg-primary-50"
        >
          Restore
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 border border-red-600 text-red-600 rounded hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
