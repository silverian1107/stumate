import { StackIcon } from '@radix-ui/react-icons';
import { ClipboardListIcon, PlusIcon, Settings } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const ActionButton = () => {
  return (
    <div className="flex w-full items-center justify-end gap-2">
      <Button variant="secondary">
        <span>
          <Settings />
        </span>
        Custom study
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <PlusIcon className="text-white" />
            Create new
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <Link href="/apps/resources/decks/new">
            <DropdownMenuItem className="cursor-pointer">
              <StackIcon className="inline-block mr-2" />
              Flashcard
            </DropdownMenuItem>
          </Link>
          <Link href="/apps/resources/quizzes/new">
            <DropdownMenuItem className="cursor-pointer">
              <ClipboardListIcon className="inline-block mr-2" />
              Quizzes
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionButton;
