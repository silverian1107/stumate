// components/ResourceHeader.tsx
'use client';

import { useState } from 'react';
import { Resource, ResourceType } from './type';
import { Button } from '@/components/ui/button';
import { PlusIcon, SaveIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';

export function ResourceHeader({
  initialData = {} as Resource,
  isEditing,
  onSubmit,
  isSubmitting,
  resourceType,
}: {
  initialData: Resource;
  isEditing: boolean;
  onSubmit: (data: Resource) => Promise<void>;
  isSubmitting: boolean;
  resourceType: ResourceType;
}) {
  const [formData, setFormData] = useState(initialData);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="w-full space-y-2 bg-white rounded-md px-4 py-6"
    >
      <div className="flex justify-between items-center">
        <h1>
          {isEditing ? 'Edit' : 'Create'} {resourceType}
        </h1>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary-500 text-white rounded"
        >
          {isEditing ? <SaveIcon /> : <PlusIcon />}
          {isEditing ? 'Save' : 'Create'}
        </Button>
      </div>
      <Button variant="outline" className="leading-none">
        Link to note
      </Button>
      <div className="space-y-4">
        <Input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          placeholder={`${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} Name`}
          className="w-full p-2 border rounded "
        />
        <AutosizeTextarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Description"
          className="w-full p-2 border rounded resize-none"
        />
      </div>
    </form>
  );
}
