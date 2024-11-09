// components/ResourceElements.tsx
'use client';

import { useState } from 'react';
import { Resource, ResourceType } from './type';
import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';
export function ResourceElements({
  initialElements,
  resourceType,
  onElementsChange,
}: {
  initialElements: Resource['elements'];
  resourceType: ResourceType;
  onElementsChange: (elements: Resource['elements']) => void;
}) {
  const [elements, setElements] = useState(initialElements);

  const handleElementChange = (
    index: number,
    fieldName: 'front' | 'back',
    newContent: string,
  ) => {
    const updatedElements = elements.map((el, i) =>
      i === index ? { ...el, [fieldName]: newContent } : el,
    );
    setElements(updatedElements);
    onElementsChange(updatedElements);
  };

  return (
    <div className="space-y-4 w-full">
      <h3>
        Total {resourceType === 'decks' ? 'Cards' : 'Questions'} (
        {elements.length})
      </h3>
      {elements.map((element, index) => (
        <div
          key={element.id || index}
          className="w-full flex gap-4 justify-between bg-white px-6 py-5 rounded-md"
        >
          <div className="flex-1">
            <p>Front</p>
            <AutosizeTextarea
              value={element.front}
              onChange={(e) =>
                handleElementChange(index, 'front', e.target.value)
              }
              className="w-full p-2 border rounded resize-none"
              minHeight={160}
            />
          </div>
          <div className="flex-1">
            <p>Back</p>
            <AutosizeTextarea
              value={element.back}
              onChange={(e) =>
                handleElementChange(index, 'back', e.target.value)
              }
              className="w-full p-2 border rounded resize-none"
              minHeight={160}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const newElement = { front: '', back: '' };
          setElements([...elements, newElement]);
          onElementsChange([...elements, newElement]);
        }}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Add Element
      </button>
    </div>
  );
}
