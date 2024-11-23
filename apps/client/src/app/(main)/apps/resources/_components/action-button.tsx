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
        <DropdownMenuTrigger>
          <Button>
            <PlusIcon className="text-white" />
            Create new
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="decks/new">Flashcard</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionButton;
