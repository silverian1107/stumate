'use client';

import React from 'react';

import type { Option } from '@/app/(main)/apps/resources/notes/_components/tag-options';
import MultipleSelector from '@/components/ui/multiple-selector';
import { cn } from '@/lib/utils';

interface InputWithMultipleSelectProps {
  options: Option[];
  value: Option[];
  defaultOptions: Option[];
  className: string;
  onSearch: (value: string) => Promise<Option[]>;
  onChange: (value: Option[]) => void;
}

const InputWithMultipleSelect: React.FC<InputWithMultipleSelectProps> = ({
  options,
  defaultOptions,
  value,
  className,
  onSearch,
  onChange
}) => {
  return (
    <div className={cn('flex w-full flex-col gap-5 px-10', className)}>
      <MultipleSelector
        onSearch={async (query) => {
          const results = await onSearch(query);
          return results;
        }}
        creatable
        triggerSearchOnFocus
        hideClearAllButton
        defaultOptions={defaultOptions}
        placeholder="Search tags..."
        loadingIndicator={
          <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
            loading...
          </p>
        }
        value={value}
        onChange={onChange}
        options={options}
        emptyIndicator={
          <p className="w-full text-center leading-6 text-muted-foreground">
            No results
          </p>
        }
      />
    </div>
  );
};

export default InputWithMultipleSelect;
