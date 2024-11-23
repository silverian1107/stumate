import type { LucideIcon } from 'lucide-react';
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Trash
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  useArchiveNoteByIdMutation,
  useCreateNoteMutation
} from '@/service/rootApi';

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  level?: number;
  active?: boolean;
  href?: string;
  id?: string;
  type?: 'Collection' | 'Note';
  isCreate?: boolean;
  expanded?: boolean;
  isButton?: boolean;
  onClick?: () => void;
  onExpand?: () => void;
}

const SidebarItem = ({
  id = '',
  href,
  label,
  icon: Icon,
  level = 0,
  expanded,
  active,
  type,
  isButton,
  // eslint-disable-next-line unused-imports/no-unused-vars
  isCreate,
  onClick,
  onExpand
}: SidebarItemProps) => {
  const CheveronIcon = expanded ? ChevronDown : ChevronRight;
  const [createNote] = useCreateNoteMutation();
  const [showInput, setShowInput] = useState(false); // State for showing input
  const [noteName, setNoteName] = useState('');
  const [archiveNoteById] = useArchiveNoteByIdMutation(); // State for storing the note name

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const handleCreateNoteClick = () => {
    setShowInput(true); // Show input field for creating note
  };

  const handleNoteNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoteName(event.target.value); // Update note name as the user types
  };

  const handleNoteNameSubmit = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // If Enter key is pressed and note name is not empty
    if (event.key === 'Enter' && noteName.trim()) {
      try {
        await createNote({ parentId: id, name: noteName });
        setShowInput(false); // Hide input field after successful creation
        setNoteName(''); // Clear the input field
      } catch (error) {
        toast.error('Failed to delete note', {
          description: 'Please try again.'
        });
      }
    }
  };
  const handleDeleteNote = async () => {
    try {
      await archiveNoteById(id);
    } catch (error) {
      toast.error('Failed to delete note', {
        description: 'Please try again.'
      });
    }
  };

  return (
    <div>
      <Link
        href={href || '#'}
        onClick={() => {
          if (type === 'Collection') {
            return;
          }
          onClick?.();
        }}
        role="button"
        className={cn(
          'flex font-medium pr-2 transition-all text-sm gap-2 items-center group',
          active && 'bg-primary-200',
          isButton
            ? 'hover:bg-primary-800 py-3 hover:text-white'
            : 'hover:bg-primary-200 py-1.5'
        )}
        style={{
          paddingLeft: level ? `${level * 8 + 12}px` : '12px'
        }}
      >
        {!!id && (
          <div
            role="button"
            className="h-full rounded-sm hover:bg-primary-100 z-50"
            onClick={handleExpand}
            tabIndex={0}
          >
            <CheveronIcon className="size-4 shrink-0" />
          </div>
        )}
        {isButton ? (
          <Icon className="size-5" />
        ) : (
          <Icon className="size-4 shrink-0" />
        )}
        <span className="truncate">{label}</span>

        {!!id && (
          <div className="ml-auto flex items-center gap-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  role="button"
                  className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-primary-100 text-black"
                >
                  <MoreHorizontal className="size-4 text-primary-900/60 hover:text-primary-900/80" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-60"
                align="start"
                side="bottom"
                forceMount
              >
                <DropdownMenuItem onClick={() => handleDeleteNote()}>
                  <Trash className="size-4 mr-2 z-50" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-sm text-muted-foreground">
                  Last edited: {new Date().toDateString()}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {type === 'Collection' ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    role="button"
                    className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-primary-100"
                  >
                    <Plus className="size-4 text-primary-900/50 hover:text-primary-900/80" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-60"
                  align="start"
                  side="bottom"
                >
                  <DropdownMenuItem onClick={() => {}}>
                    <Plus className="size-4 mr-2" />
                    Create Collection
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCreateNoteClick}>
                    <Plus className="size-4 mr-2" />
                    Create Note
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div
                role="button"
                onClick={() => {}}
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-primary-100"
                tabIndex={0}
              >
                <Plus className="size-4 text-primary-900/50 hover:text-primary-900/80" />
              </div>
            )}
          </div>
        )}
      </Link>
      {/* Input field for note name, positioned below the item */}
      {showInput && (
        <div className="w-full mt-3 pl-6 flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter note name"
            value={noteName}
            onChange={handleNoteNameChange}
            onKeyDown={handleNoteNameSubmit} // Listen for the Enter key
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
