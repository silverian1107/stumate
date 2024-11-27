'use client';

import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import type { QuizCreateDto } from '@/endpoints/quiz-api';
import { useQuizCreate } from '@/hooks/use-quiz';

import { ResourceElements } from '../../../_components/creator';
import { QuizHeader } from '../../_components/headers';

export default function ResourcePage() {
  const { id } = useParams();
  const createQuiz = useQuizCreate();

  const handleSubmit = async (formData: QuizCreateDto) => {
    try {
      if (!id) {
        await createQuiz.mutateAsync(formData);
      }
    } catch {
      toast.error('Failed to create resource');
    }
  };

  return (
    <>
      <QuizHeader
        // initialData={initialResource}
        // isEditing={isEditing}
        onSubmit={handleSubmit}
        // isSubmitting={isSubmitting}
      />
      <ResourceElements />
    </>
  );
}
