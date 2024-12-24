import { BookOpen, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';

import {
  useCreateDeck,
  useDeckByNoteId,
  useGenerateFlashcardsByAI
} from '@/hooks/use-deck';
import { useNoteById } from '@/hooks/use-note';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Spinner } from '../ui/spinner'; // Import the Spinner component

export const DeckTabContent = () => {
  const { data: note, isLoading: isLoadingNote } = useNoteById();
  const { data, isLoading } = useDeckByNoteId(note._id);

  const createDeckMutation = useCreateDeck();
  const generateFlashcardsByAIMutation = useGenerateFlashcardsByAI();

  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [isGeneratingByAI, setIsGeneratingByAI] = useState(false);

  const handleCreateDeck = async () => {
    setIsCreatingDeck(true);
    try {
      await createDeckMutation.mutateAsync({
        noteId: note._id,
        name: `${note.name}'s Deck`,
        description: 'New deck description'
      });
    } finally {
      setIsCreatingDeck(false);
    }
  };

  const handleGenerateByAI = async () => {
    setIsGeneratingByAI(true);
    try {
      const newDeckData = await createDeckMutation.mutateAsync({
        noteId: note._id,
        name: `${note.name}'s Deck`,
        description: 'New deck description'
      });

      await generateFlashcardsByAIMutation.mutateAsync({
        deckId: newDeckData._id,
        noteId: note._id
      });
    } finally {
      setIsGeneratingByAI(false);
    }
  };

  if (isLoading || isLoadingNote) {
    return (
      <Card>
        <CardContent>Loading...</CardContent>
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
                {flashcards?.length || 0} cards
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
              variant="secondary"
            >
              Edit
            </Button>
            <Button className="w-full" disabled={flashcards.length === 0}>
              Review Deck
            </Button>
          </>
        ) : (
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateDeck}
              disabled={isCreatingDeck}
            >
              {isCreatingDeck ? (
                <Spinner size="small" />
              ) : (
                <Plus className="size-4 mr-2" />
              )}
              Create Deck
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateByAI}
              disabled={isGeneratingByAI}
            >
              {isGeneratingByAI ? (
                <Spinner size="small" />
              ) : (
                <Sparkles className="size-4 mr-2" />
              )}
              Generate by AI
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
