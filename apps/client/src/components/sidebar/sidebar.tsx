'use client';

import { formatDistanceToNow } from 'date-fns';
import { BarChart2, Calendar, Clock, Tag } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNoteById } from '@/hooks/use-note';
import { useSummaryByNoteId } from '@/hooks/use-summary';

import { DeckTabContent } from './deck-tab-content';
import QuizTabContent from './quiz-tab-content';
import { SummaryTabContent } from './summary-tab-content';

export function LearnerSidebar() {
  const { data, isLoading } = useSummaryByNoteId();
  const { data: note, isLoading: isLoadingNote } = useNoteById();

  if (isLoading || isLoadingNote) return <div>Loading...</div>;

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const totalWordCount = () => {
    if (note?.body?.blocks) {
      return note.body.blocks.reduce((total: number, block: any) => {
        return total + countWords(block.data.text);
      }, 0);
    }
    return 0;
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4 bg-background border-l">
      <Card className="flex-none">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-4" />
            Last edited:{' '}
            {formatDistanceToNow(note?.updatedAt, { addSuffix: true })}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tag className="size-4" />
            Tags: {data?.tags?.join(', ') || 'No tags'}
          </div>
          <div>
            <span className="text-sm font-medium">
              Word count: {totalWordCount()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="deck">Deck</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="grow overflow-auto">
          <SummaryTabContent />
        </TabsContent>

        <TabsContent value="deck" className="grow overflow-auto">
          <DeckTabContent />
        </TabsContent>

        <TabsContent value="quizzes" className="grow overflow-auto">
          <QuizTabContent />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="size-4" />
            Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Daily Study Time</span>
              <span className="text-sm text-muted-foreground">1h 30m / 2h</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Weekly Quiz Score</span>
              <span className="text-sm text-muted-foreground">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Revision Schedule</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              Next review: Tomorrow
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Mastery Level</h4>
            <p className="text-sm text-muted-foreground">
              Intermediate (Level 3/5)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
