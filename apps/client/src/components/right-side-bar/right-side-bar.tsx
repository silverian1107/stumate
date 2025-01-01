'use client';

import { BarChart2, Calendar, Clock, Tag } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNoteById } from '@/hooks/use-note';
import { useSummaryByNoteId } from '@/hooks/use-summary';
import formatShortDistanceToNow from '@/lib/utils';

import { DeckTabContent } from './deck-tab-content';
import QuizTabContent from './quiz-tab-content';
import { SummaryTabContent } from './summary-tab-content';

export function LearnerSidebar() {
  const { isLoading } = useSummaryByNoteId();
  const { data: note, isLoading: isLoadingNote } = useNoteById();

  if (isLoading || isLoadingNote) return <div>Loading...</div>;

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const totalWordCount = () => {
    if (note?.body?.blocks) {
      return note.body.blocks
        .filter((block: any) => block?.data?.text)
        .reduce((total: number, block: any) => {
          return total + countWords(block.data.text);
        }, 0);
    }
    return 0;
  };

  const truncateTag = (tag: string) => {
    const words = tag.split(' ');
    if (words.length > 7) {
      return `${words.slice(0, 5).join(' ')}...`;
    }
    return tag;
  };

  const tagLimit = 3;
  const tagList = note?.tags?.slice(0, tagLimit).map((tag: any) => (
    <span
      key={tag._id}
      className="bg-primary-50 px-1 py-0.5 rounded-full text-primary-700"
    >
      {truncateTag(tag.name)}
    </span>
  ));

  return (
    <div className="h-full flex flex-col p-4 space-y-4 bg-background border-l">
      <Card className="flex-none space-y-2">
        <CardHeader className="px-6 pt-3 pb-1">
          <CardTitle className="text-lg flex items-center">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 text-xs text-muted-foreground leading-none tracking-tight justify-between w-full">
              <p className="flex gap-0.5">
                <Clock className="size-3" />
                Last edited:{' '}
              </p>
              <span className="text-black">
                {note?.updatedAt
                  ? formatShortDistanceToNow(new Date(note.updatedAt))
                  : 'N/A'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground line-clamp-2">
            <Tag className="size-3" />
            Tags:
            <span className="text-black space-x-0.5">
              {tagList}
              {note?.tags?.length > tagLimit && (
                <span className="bg-primary-50 px-1 py-0.5 rounded-full text-primary-700">
                  ...
                </span>
              )}
            </span>
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
