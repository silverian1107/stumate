'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Deck } from '@/types/deck';

const DeckSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional()
});

type ResourceFormData = z.infer<typeof DeckSchema>;
export function DeckActionHeader({
  initialData = {} as Deck,
  isEditing,
  onSubmit,
  isSubmitting
}: {
  initialData?: Deck;
  isEditing?: boolean;
  onSubmit: (data: ResourceFormData) => Promise<void>;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResourceFormData>({
    resolver: zodResolver(DeckSchema),
    defaultValues: {
      name: initialData.name || '',
      description: initialData.description || ''
    }
  });

  // useEffect(() => {
  //   reset({
  //     name: initialData.name,
  //     description: initialData.description
  //   });
  // }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative w-full space-y-2 rounded-md bg-white p-4 pb-10"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-600">
          {isEditing ? 'Edit' : 'Create'} Deck
        </h1>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-primary-500 px-4 py-2 text-white"
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
          placeholder="Deck Name"
          className={cn(
            'w-full p-2 border rounded',
            errors.name &&
              'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
          )}
        />
        <AutosizeTextarea
          {...register('description')}
          placeholder="Description"
          className="w-full resize-none rounded border p-2"
        />
      </div>
      {errors.name && (
        <p className="absolute bottom-4 text-red-500">*{errors.name.message}</p>
      )}
    </form>
  );
}
