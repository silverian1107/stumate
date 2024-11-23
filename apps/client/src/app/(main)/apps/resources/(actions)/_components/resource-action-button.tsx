import type { UnknownAction } from '@reduxjs/toolkit';
import { PlusIcon, Trash2Icon, UndoIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { FlashcardElement, QuizElement } from '@/types/deck';

interface ResourceActionButtonProps {
  resouces: FlashcardElement[] | QuizElement[];
  addNewAction: () => UnknownAction;
  clearAction: () => UnknownAction;
  removeAction: () => UnknownAction;
}

const ResourceActionButton = ({
  resouces,
  addNewAction,
  clearAction,
  removeAction
}: ResourceActionButtonProps) => {
  const [isRemoveAll, setIsRemoveAll] = useState(false);
  const dispatch = useDispatch();

  const handlePermanentDelete = () => {
    // dispatch(permanentlyDeleteCards());
    toast('Cards Permanently Deleted', {
      description: "Haven't implemented yet."
    });
    // setIsRemoveAll(false);
  };

  return (
    <div className="flex justify-end gap-2">
      {isRemoveAll && (
        <Button
          variant="destructive"
          onClick={handlePermanentDelete}
          className="inline-flex"
        >
          <Trash2Icon />
          Permanent Delete
        </Button>
      )}

      {isRemoveAll ? (
        <Button
          variant="secondary"
          onClick={() => {
            dispatch(removeAction());
            setIsRemoveAll(false);
          }}
          className="ml-auto rounded"
        >
          <UndoIcon />
          Restore
        </Button>
      ) : (
        <Button
          variant="secondary"
          onClick={() => {
            dispatch(clearAction());
            setIsRemoveAll(true);
          }}
          disabled={resouces.length === 0}
          className="ml-auto rounded"
        >
          <XIcon />
          Clear all
        </Button>
      )}

      <Button
        onClick={() => dispatch(addNewAction())}
        className="rounded text-white"
      >
        <PlusIcon />
        Add Element
      </Button>
    </div>
  );
};

export default ResourceActionButton;
