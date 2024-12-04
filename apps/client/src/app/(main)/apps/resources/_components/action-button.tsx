import { StackIcon } from '@radix-ui/react-icons';
import { PlusIcon, Settings } from 'lucide-react';
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
          <DropdownMenuItem>
            <Link href="decks/new">
              <StackIcon className="inline-block mr-2" />
              Flashcard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/apps/resources/quizzes/new">Quizzes</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionButton;
