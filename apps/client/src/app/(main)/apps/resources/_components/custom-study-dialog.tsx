'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CustomAttempt } from '@/endpoints/quiz/quiz-attempt';
import { useQuizzesByOwnerWithPagination } from '@/hooks/quiz/use-quiz';
import { useCreateCustomQuizAttempt } from '@/hooks/quiz/use-quiz-attempt';
import { cn } from '@/lib/utils';

export function CustomStudyDialog() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: quizzes, isLoading } = useQuizzesByOwnerWithPagination(
    currentPage,
    10
  );

  const createCustomedAttempt = useCreateCustomQuizAttempt();

  const totalResults = quizzes?.meta?.total || 0;
  const pageSize = quizzes?.meta?.pageSize || 10;
  const totalPages = Math.ceil(totalResults / pageSize);
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);

  const { handleSubmit, control, setValue, watch } = useForm<CustomAttempt>({
    defaultValues: {
      selectedQuizzes: [],
      duration: 0,
      numberOfQuestions: 1
    }
  });

  const selectedQuizzes = watch('selectedQuizzes');

  const handleQuizSelect = (quizId: string) => {
    setValue(
      'selectedQuizzes',
      selectedQuizzes.includes(quizId)
        ? selectedQuizzes.filter((id) => id !== quizId)
        : [...selectedQuizzes, quizId]
    );
  };

  const onSubmit = async (data: CustomAttempt) => {
    await createCustomedAttempt.mutateAsync(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Settings className="size-4" />
          Custom study
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg h-[72vh] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Custom Study</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="quizzes" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="decks">Decks</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          <TabsContent value="decks" className="flex-1">
            <p className="text-center py-4">Coming soon</p>
          </TabsContent>
          <TabsContent value="quizzes" className="flex-1 flex flex-col">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex-1 flex flex-col"
            >
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <Input id="duration" type="number" {...field} required />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <Controller
                  name="numberOfQuestions"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="numberOfQuestions"
                      type="number"
                      min="1"
                      {...field}
                      required
                    />
                  )}
                />
              </div>
              <div className="space-y-2 flex-1 flex flex-col">
                <Label>Select Quizzes</Label>
                {isLoading ? (
                  <p>Loading quizzes...</p>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <p className="w-full text-right mt-2 text-xs text-gray-500">
                      Showing {startResult}-{endResult} of {totalResults}{' '}
                      quizzes
                    </p>
                    <div className="overflow-auto flex-1 mt-2 border rounded border-primary-200 py-0.5">
                      <div className="flex flex-col gap-1">
                        {quizzes?.result.map((quiz) => (
                          <div
                            key={quiz._id}
                            className={cn(
                              'flex items-center space-x-2 px-2 py-1 hover:bg-primary-50',
                              selectedQuizzes.includes(quiz._id) &&
                                'bg-primary-100'
                            )}
                          >
                            <Checkbox
                              id={quiz._id}
                              checked={selectedQuizzes.includes(quiz._id)}
                              onCheckedChange={() => handleQuizSelect(quiz._id)}
                            />
                            <Label
                              htmlFor={quiz._id}
                              className="flex-1 cursor-pointer"
                            >
                              {quiz.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prevPage) =>
                            Math.max(prevPage - 1, 1)
                          )
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prevPage) =>
                            Math.min(prevPage + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create Custom Study</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
