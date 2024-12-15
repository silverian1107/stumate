import { useCreateDeck, useDeckByNoteId } from '@/hooks/use-deck';
import { Plus, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useNoteById } from '@/hooks/use-note';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

export const DeckTabContent = () => {
  const { data: note, isLoading: isLoadingNote } = useNoteById();
  const { data, isLoading, error } = useDeckByNoteId(note._id);

  const createDeckMutation = useCreateDeck();

  // Handlers
  const handleCreateDeck = () => {
    createDeckMutation.mutate({
      noteId: note._id,
      name: `${note.name}'s Deck`,
      description: 'New deck description'
    });
  };

  // UI State
  if (isLoading || isLoadingNote) {
    return (
      <Card>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>Error fetching deck: {error.message}</CardContent>
      </Card>
    );
  }

  const hasDeck = !!data;
  const { deck, flashcards } = data || {};

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="size-4" />
          Associated Deck
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasDeck ? (
          <>
            <div>
              <h4 className="font-medium">{deck.name || 'Untitled Deck'}</h4>
              <p className="text-sm text-muted-foreground">
                {deck?.cardCount || 0} cards
              </p>
            </div>
            <Progress
              value={
                ((deck?.reviewedCardCount || 0) / (deck?.cardCount || 1)) * 100
              }
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {deck?.reviewedCardCount || 0}/{deck?.cardCount || 0} cards
              reviewed
            </p>
            <Button
              className="w-full hover:bg-primary-50/80 bg-primary-50 text-primary-600"
              variant={'secondary'}
            >
              Edit
            </Button>
            <Button className="w-full" disabled={flashcards.length === 0}>
              Review Deck
            </Button>
          </>
        ) : (
          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="sm" onClick={handleCreateDeck}>
              <Plus className="size-4 mr-2" />
              Create Deck
            </Button>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Sparkles className="size-4 mr-2" />
              Generate by AI
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
