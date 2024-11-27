import { TrashIcon, Undo2Icon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';
import { useRemoveFLashcard } from '@/hooks/use-flashcard';
import { cn } from '@/lib/utils';
import {
  permanentlyDeleteACard,
  removeFlashcard,
  restoreFlashcard,
  updateFlashcards
} from '@/redux/slices/resourceSlice';
import type { FlashcardElementWithAction } from '@/types/deck';

const FlashcardField = ({
  element,
  index,
  frontError,
  backError
}: {
  element: FlashcardElementWithAction;
  index: number;
  frontError: boolean;
  backError: boolean;
}) => {
  const dispatch = useDispatch();
  const [frontErrorState, setFrontErrorState] = useState(frontError);
  const [backErrorState, setBackErrorState] = useState(backError);

  const removeFlashcardMutation = useRemoveFLashcard();

  const handleElementChange = (fieldName: string, newContent: string) => {
    dispatch(updateFlashcards({ index, fieldName, value: newContent }));
  };
  useEffect(() => {
    if (frontError) {
      setFrontErrorState(true);
    } else {
      setFrontErrorState(false);
    }
  }, [frontError]);

  useEffect(() => {
    if (backError) {
      setBackErrorState(true);
    } else {
      setBackErrorState(false);
    }
  }, [backError]);

  const handleRemoveFlashcard = () => {
    if (
      !element.back &&
      !element.front &&
      element.originalAction === 'create'
    ) {
      dispatch(permanentlyDeleteACard(index));
      toast('Flashcard Deleted', {
        description: 'Flashcard has been deleted.'
      });
    } else {
      dispatch(removeFlashcard(index));
    }
  };

  const handlePermanentlyDeleteFlashcard = () => {
    dispatch(permanentlyDeleteACard(index));
    removeFlashcardMutation.mutate({
      deckId: element.deckId!,
      _id: element._id!
    });
  };

  const getBorderStyle = () => {
    if (element.isDeleted) return 'opacity-70 border-gray-300';
    return '';
  };

  const ActionButton = (
    <>
      <button
        type="button"
        onClick={handleRemoveFlashcard}
        className={cn(element.isDeleted ? 'hidden' : '')}
      >
        <XIcon className="size-6 text-primary-400" />
      </button>
      <button
        type="button"
        onClick={handlePermanentlyDeleteFlashcard}
        className={cn(element.isDeleted ? '' : 'hidden')}
      >
        <TrashIcon className="size-6 text-primary-400" />
      </button>
      <button
        type="button"
        onClick={() => dispatch(restoreFlashcard(index))}
        className={cn(element.isDeleted ? '' : 'hidden')}
      >
        <Undo2Icon className="size-6 text-primary-400" />
      </button>
    </>
  );

  const textLabel = (
    <code
      className={cn(
        'text-[10px] uppercase border p-0.5 leading-none cursor-default rounded-sm',
        element.isDeleted
          ? 'border-red-400 text-red-400'
          : element.action === 'update'
            ? 'border-primary-500 text-primary-500'
            : element.originalAction === 'create'
              ? 'border-green-500 text-green-500'
              : ''
      )}
    >
      {element.isDeleted
        ? 'Deleted'
        : element.action === 'update'
          ? 'Update'
          : element.originalAction === 'create'
            ? 'New'
            : null}
    </code>
  );

  return (
    <div
      className={cn(
        'w-full flex flex-col md:flex-row gap-4 justify-between bg-white px-6 py-5 rounded-md relative',
        getBorderStyle()
      )}
    >
      <div className="absolute right-2 top-1 flex items-center gap-1">
        {textLabel}
        {ActionButton}
      </div>
      <div className="flex-1">
        <p className={cn(frontErrorState && 'text-red-600')}>
          Front
          {frontErrorState && (
            <span className="text-[10px]"> (Must not be empty)</span>
          )}
        </p>
        <AutosizeTextarea
          value={element.front}
          onChange={(e) => {
            handleElementChange('front', e.target.value);
            if (!e.target.value.trim().length) {
              setFrontErrorState(true);
            } else {
              setFrontErrorState(false);
            }
          }}
          className="mt-1 w-full resize-none rounded border p-2"
          minHeight={160}
          disabled={element.isDeleted}
        />
      </div>
      <div className="flex-1">
        <p className={cn(backErrorState && 'text-red-600')}>
          Back
          {backErrorState && (
            <span className="text-[10px]"> (Must not be empty)</span>
          )}
        </p>
        <AutosizeTextarea
          value={element.back}
          onChange={(e) => {
            handleElementChange('back', e.target.value);
            if (!e.target.value.trim().length) {
              setBackErrorState(true);
            } else {
              setBackErrorState(false);
            }
          }}
          className="mt-1 w-full resize-none rounded border p-2"
          minHeight={160}
          disabled={element.isDeleted}
        />
      </div>
    </div>
  );
};

export default FlashcardField;
