import { ArchiveIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ArchivedResourcesDialog = () => {
  const [open, setOpen] = useState(false);
  // const { data, isLoading } = useGetArchivedDeck();

  // if (isLoading) return null;
  // console.log(data);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mr-auto text-primary-950/40 border-primary-950/40 bg-transparent hover:bg-transparent hover:border-primary-600 hover:text-primary-600"
        >
          <ArchiveIcon className="size-4" />
          Archived Resources
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archived Resources</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="deck">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deck">Deck</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          <TabsContent value="deck">
            {/* Content for Deck tab */}
            <p>Deck content goes here.</p>
          </TabsContent>
          <TabsContent value="quizzes">
            {/* Content for Quizzes tab */}
            <p>Quizzes content goes here.</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
