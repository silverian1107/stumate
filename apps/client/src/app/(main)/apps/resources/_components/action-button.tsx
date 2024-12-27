import { StackIcon } from '@radix-ui/react-icons';
import { ClipboardListIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { ArchivedResourcesDialog } from './ArchivedResourcesDialog';
import { CustomStudyDialog } from './custom-study-dialog';

const ActionButton = () => {
  return (
    <div className="flex w-full items-center justify-end gap-2">
      <ArchivedResourcesDialog />
      <CustomStudyDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <PlusIcon className="size-4" />
            Create new
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <Link href="/apps/resources/decks/new">
            <DropdownMenuItem className="cursor-pointer">
              <StackIcon className="mr-2 size-4" />
              Flashcard
            </DropdownMenuItem>
          </Link>
          <Link href="/apps/resources/quizzes/new">
            <DropdownMenuItem className="cursor-pointer">
              <ClipboardListIcon className="mr-2 size-4" />
              Quizzes
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionButton;
