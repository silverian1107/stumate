import type { LucideIcon } from 'lucide-react';
import {
  Archive,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useArchiveCollection } from '@/hooks/use-collection';
import { useArchiveNote } from '@/hooks/use-note';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  level?: number;
  active?: boolean;
  href?: string;
  id?: string;
  type?: 'Collection' | 'Note';
  expanded?: boolean;
  isButton?: boolean;
  onClick?: () => void;
  onCreateNote?: () => void;
  onCreateCollection?: () => void;
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
  onClick,
  onCreateNote,
  onCreateCollection,
  onExpand
}: SidebarItemProps) => {
  const CheveronIcon = expanded ? ChevronDown : ChevronRight;
  const archiveNote = useArchiveNote();
  const archiveCollection = useArchiveCollection();

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const handleCreateNote = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onCreateNote?.();
  };

  const handleCreateCollection = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onCreateCollection?.();
  };

  const handleDeleteNote = async () => {
    if (type === 'Note') {
      archiveNote.mutate(id);
    } else {
      archiveCollection.mutate(id);
    }
  };

  return (
    <div>
      <Link
        href={href || '#'}
        onClick={onClick}
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
                  <Archive className="size-4 mr-2 z-50" />
                  Archive
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
                  <DropdownMenuItem onClick={handleCreateCollection}>
                    <Plus className="size-4 mr-2" />
                    Create Collection
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCreateNote}>
                    <Plus className="size-4 mr-2" />
                    Create Note
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div
                role="button"
                onClick={handleCreateNote}
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-primary-100"
                tabIndex={0}
              >
                <Plus className="size-4 text-primary-900/50 hover:text-primary-900/80" />
              </div>
            )}
          </div>
        )}
      </Link>
    </div>
  );
};

export default SidebarItem;
