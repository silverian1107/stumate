'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, SaveIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';

import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputWithEndInline from '@/components/ui/number-input';
import { useQuizById } from '@/hooks/quiz/use-quiz';
import { cn } from '@/lib/utils';
import type { RootState } from '@/redux/store';
import type { Quiz } from '@/types/deck';

interface QuizHeaderProps {
  initialData?: Quiz;
  isEditing?: boolean;
  onSubmit: (data: ResourceFormData) => void;
  isSubmitting?: boolean;
}

const QuizSchema = z.object({
  name: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  numberOfQuestion: z.number().min(1, 'Number of question is required'),
  duration: z.number().min(1, 'Duration is required')
});

type ResourceFormData = z.infer<typeof QuizSchema>;

export function QuizHeader({
  isEditing,
  onSubmit,
  isSubmitting
}: QuizHeaderProps) {
  const { data, isLoading, error } = useQuizById();
  const questions = useSelector((state: RootState) => state.quiz.questions);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ResourceFormData>({
    resolver: zodResolver(QuizSchema)
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || '',
        description: data.description || '',
        numberOfQuestion: data.numberOfQuestion || 0,
        duration: data.duration || 0
      });
    }
  }, [data, reset]);

  useEffect(() => {
    const filteredQuestions = questions.filter(
      (question) => question.action !== 'delete'
    );
    setValue('numberOfQuestion', filteredQuestions.length);
  }, [questions, setValue]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative w-full md:w-3/4 mx-auto space-y-2 rounded-md bg-white p-4 pb-10"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-600">
          {isEditing ? 'Edit' : 'Create'} Quiz
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
      {/* <Button variant="outline" className="leading-none">
        Link to note
      </Button> */}
      <div className="space-y-4">
        <div className="flex gap-2 flex-col lg:flex-row">
          <Input
            type="text"
            placeholder="Quizz Title"
            className={cn(
              ' p-2 border basis-3/4 ',
              errors.name &&
                'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
            )}
            {...register('name')}
          />
          <div className="flex gap-2 w-full flex-col md:flex-row">
            <InputWithEndInline
              type="number"
              className={cn(
                'flex-1',
                errors.duration &&
                  'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
              )}
              {...register('duration', {
                setValueAs: (value) => Number(value)
              })}
              inlineText="Minutes"
              min={1}
              max={180}
            />
            <InputWithEndInline
              type="number"
              className={cn(
                'flex-1',
                errors.numberOfQuestion &&
                  'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
              )}
              {...register('numberOfQuestion', {
                setValueAs: () => Number(questions.length)
              })}
              disabled
              min={1}
              max={180}
              inlineText="Questions"
            />
          </div>
        </div>

        <AutosizeTextarea
          {...register('description')}
          placeholder="Description"
          className="w-full resize-none rounded border p-2"
        />
      </div>
      {Object.entries(errors).length > 0 && (
        <p className="text-red-500 text-sm">
          *{Object.values(errors)[0].message}
        </p>
      )}
    </form>
  );
}
