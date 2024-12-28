import { Archive } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteQuiz,
  useGetArchivedQuizzes,
  useRestoreQuiz
} from '@/hooks/quiz/use-quiz';
import {
  useDeleteDeck,
  useGetArchivedDeck,
  useRestoreDeck
} from '@/hooks/use-deck';

import { ArchivedItem } from './archived-deck-item';

export const ArchivedResourcesDialog = () => {
  const [open, setOpen] = useState(false);
  const { data: deck, isLoading: isDeckLoading } = useGetArchivedDeck();
  const { data: quiz, isLoading: isQuizLoading } = useGetArchivedQuizzes();

  const restoreDeck = useRestoreDeck();
  const deleteDeck = useDeleteDeck();
  const restoreQuiz = useRestoreQuiz();
  const deleteQuiz = useDeleteQuiz();

  if (isDeckLoading || isQuizLoading) return null;

  const handleRestoreDeck = async (id: string) => {
    await restoreDeck.mutateAsync(id);
    toast.success('Deck restored successfully!');
  };

  const handleRestoreQuiz = async (id: string) => {
    await restoreQuiz.mutateAsync(id);
    toast.success('Quiz restored successfully!');
  };

  const handleDeleteDeck = async (id: string) => {
    await deleteDeck.mutateAsync(id);
    toast.success('Deck deleted successfully!');
  };

  const handleDeleteQuiz = async (id: string) => {
    await deleteQuiz.mutateAsync(id);
    toast.success('Quiz deleted successfully!');
  };

  const { result: resultDeck } = deck;
  const { result: resultQuiz } = quiz;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mr-auto text-primary-950/40 border-primary-950/40 bg-transparent hover:bg-transparent hover:border-primary-600 hover:text-primary-600"
        >
          <Archive className="size-4 mr-2" />
          Archived Resources
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Archived Resources</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="deck">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deck">Deck</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          <TabsContent value="deck">
            <div className="space-y-2 mt-4 h-[60vh] overflow-y-auto">
              {resultDeck && resultDeck.length > 0 ? (
                resultDeck.map(
                  (item: {
                    _id: string;
                    name: string;
                    description: string;
                  }) => (
                    <ArchivedItem
                      key={item._id}
                      name={item.name}
                      description={item.description}
                      onRestore={() => handleRestoreDeck(item._id)}
                      onDelete={() => handleDeleteDeck(item._id)}
                    />
                  )
                )
              ) : (
                <p className="text-center text-gray-500">
                  No archived decks found.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="quizzes">
            <div className="space-y-2 mt-4 h-[60vh] overflow-y-auto">
              {resultQuiz && resultQuiz.length > 0 ? (
                resultQuiz.map(
                  (item: {
                    _id: string;
                    name: string;
                    description: string;
                  }) => (
                    <ArchivedItem
                      key={item._id}
                      name={item.name}
                      description={item.description}
                      onRestore={() => handleRestoreQuiz(item._id)}
                      onDelete={() => handleDeleteQuiz(item._id)}
                    />
                  )
                )
              ) : (
                <p className="text-center text-gray-500">
                  No archived quiz found.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
