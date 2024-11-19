import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';
import { cn } from '@/lib/utils';
import {
  removeFlashcard,
  restoreFlashcard,
  updateFlashcards,
} from '@/redux/slices/resourceSlice';
import { FlashcardElementWithAction } from '@/types/deck';
import { UndoIcon, XIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';

const FlashcardField = ({
  element,
  index,
}: {
  element: FlashcardElementWithAction;
  index: number;
}) => {
  const dispatch = useDispatch();

  const handleElementChange = (
    index: number,
    fieldName: string,
    newContent: string,
  ) => {
    dispatch(updateFlashcards({ index, fieldName, value: newContent }));
  };

  const getBorderStyle = () => {
    if (element.isDeleted) return 'opacity-70 border-gray-300';
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col md:flex-row gap-4 justify-between bg-white px-6 py-5 rounded-md relative',
        getBorderStyle(),
      )}
    >
      <div className="absolute top-1 right-2 flex gap-2 items-center">
        <code
          className={cn(
            'uppercase text-[10px] border px-1 rounded-sm leading-none',
            element.action === 'delete'
              ? 'text-red-600 border-red-600'
              : element.originalAction === 'create'
                ? 'text-green-600 border-green-600'
                : element.action === 'update'
                  ? 'text-primary-600 border-primary-600'
                  : 'hidden',
          )}
        >
          {element.action === 'delete'
            ? 'deleted'
            : element.originalAction === 'create'
              ? 'new'
              : element.action === 'update'
                ? 'changed'
                : null}
        </code>
        <XIcon
          onClick={() => {
            dispatch(removeFlashcard(index));
          }}
          role="button"
          className={cn(
            'w-6 h-6 cursor-pointer text-primary-200',
            element.isDeleted ? 'hidden' : 'block',
          )}
        />
        <UndoIcon
          onClick={() => {
            dispatch(restoreFlashcard(index));
          }}
          role="button"
          className={cn(
            'w-6 h-6 cursor-pointer text-primary-300 z-10',
            element.isDeleted ? 'block' : 'hidden',
          )}
        />
      </div>
      <div className="flex-1">
        <p>Front</p>
        <AutosizeTextarea
          value={element.front}
          onChange={(e) => handleElementChange(index, 'front', e.target.value)}
          className="w-full p-2 border rounded resize-none mt-1"
          minHeight={160}
          disabled={element.isDeleted}
        />
      </div>
      <div className="flex-1">
        <p>Back</p>
        <AutosizeTextarea
          value={element.back}
          onChange={(e) => handleElementChange(index, 'back', e.target.value)}
          className="w-full p-2 border rounded resize-none mt-1"
          minHeight={160}
          disabled={element.isDeleted}
        />
      </div>
    </div>
  );
};

export default FlashcardField;
