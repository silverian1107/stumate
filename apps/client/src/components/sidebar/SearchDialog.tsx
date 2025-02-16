import Link from 'next/link';
import React, { useState } from 'react';

import { useSearch } from '@/hooks/use-search';
import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { Input } from '../ui/input';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading } = useSearch(query, currentPage);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to the first page on new search
  };

  const totalResults = data?.meta?.total || 0;
  const pageSize = data?.meta?.pageSize || 10;
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[80vh] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Enter your search query below.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSearch}
          className="mb-2 flex justify-between gap-2"
        >
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className=" border rounded w-full"
          />
          <button
            type="submit"
            className="p-2 py-1 bg-primary-600 hover:bg-primary-500 text-white rounded"
          >
            Search
          </button>
        </form>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <div className="flex flex-col flex-1 max-h-[52vh]">
            <p className="mt-2 text-sm text-gray-500">
              Showing {startResult}-{endResult} of {totalResults} results
            </p>
            <div className="overflow-auto">
              <div className="mt-2 flex flex-col gap-1">
                {data.result.map((item: any) => (
                  <Link
                    href={
                      item.type === 'note'
                        ? `/apps/resources/notes/${item._id}`
                        : item.type === 'deck'
                          ? `/apps/resources/decks/new/${item._id}`
                          : `/apps/resources/quizzes/edit/${item._id}`
                    }
                    key={item._id}
                    onClick={() => onClose()}
                    className="bg-primary-50/60 rounded px-2 py-1 hover:bg-primary-50"
                  >
                    <span className="flex flex-col gap-1">
                      <span
                        className={cn(
                          'text-xs text-gray-500 capitalize font-medium',
                          item.type === 'note'
                            ? 'text-blue-500'
                            : item.type === 'deck'
                              ? 'text-green-500'
                              : 'text-orange-500'
                        )}
                      >
                        {item.type === 'quizTest' ? 'Quiz' : item.type}
                      </span>
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        {data && (
          <div className="mt-auto flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
              }
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-300'
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {data.meta.pages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
              disabled={currentPage === data.meta.pages}
              className={`p-2 rounded ${
                currentPage === data.meta.pages
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        )}
        <DialogClose asChild>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white bg-primary-600 hover:bg-primary-500 rounded"
          >
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
