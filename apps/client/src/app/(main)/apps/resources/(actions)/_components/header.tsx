'use client';

import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { Deck } from '@/types/deck';

const DeckSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type ResourceFormData = z.infer<typeof DeckSchema>;
export function ResourceHeader({
  initialData = {} as Deck,
  isEditing,
  onSubmit,
  isSubmitting,
}: {
  initialData?: Deck;
  isEditing: boolean;
  onSubmit: (data: ResourceFormData) => Promise<void>;
  isSubmitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResourceFormData>({
    resolver: zodResolver(DeckSchema),
    defaultValues: {
      name: initialData.name || '',
      description: initialData.description || '',
    },
  });

  useEffect(() => {
    reset({
      name: initialData.name,
      description: initialData.description,
    });
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-2 bg-white rounded-md px-4 py-4 pb-10 relative"
    >
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl text-primary-600">
          {isEditing ? 'Edit' : 'Create'} Deck
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
          {...register('name')}
          placeholder={`Deck Name`}
          className={cn(
            'w-full p-2 border rounded',
            errors.name &&
              'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500',
          )}
        />
        <AutosizeTextarea
          {...register('description')}
          placeholder="Description"
          className="w-full p-2 border rounded resize-none"
        />
      </div>
      {errors.name && (
        <p className="text-red-500 absolute bottom-4">*{errors.name.message}</p>
      )}
    </form>
  );
}
