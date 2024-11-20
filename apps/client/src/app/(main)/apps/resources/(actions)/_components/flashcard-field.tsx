import { useDispatch } from 'react-redux';

import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';
import { cn } from '@/lib/utils';
import { updateFlashcards } from '@/redux/slices/resourceSlice';
import type { FlashcardElementWithAction } from '@/types/deck';

const FlashcardField = ({
  element,
  index
}: {
  element: FlashcardElementWithAction;
  index: number;
}) => {
  const dispatch = useDispatch();

  const handleElementChange = (fieldName: string, newContent: string) => {
    dispatch(updateFlashcards({ index, fieldName, value: newContent }));
  };

  const getBorderStyle = () => {
    if (element.isDeleted) return 'opacity-50 border-gray-300';
    if (element.originalAction === 'create')
      return 'border-2 border-green-600/30';
    if (element.action === 'update') return 'border-2 border-primary-600/30';
    return '';
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col md:flex-row gap-4 justify-between bg-white px-6 py-5 rounded-md',
        getBorderStyle()
      )}
    >
      <div className="flex-1">
        <p>Front</p>
        <AutosizeTextarea
          value={element.front}
          onChange={(e) => handleElementChange('front', e.target.value)}
          className="mt-1 w-full resize-none rounded border p-2"
          minHeight={160}
          disabled={element.isDeleted}
        />
      </div>
      <div className="flex-1">
        <p>Back</p>
        <AutosizeTextarea
          value={element.back}
          onChange={(e) => handleElementChange('back', e.target.value)}
          className="mt-1 w-full resize-none rounded border p-2"
          minHeight={160}
          disabled={element.isDeleted}
        />
      </div>
    </div>
  );
};

export default FlashcardField;
