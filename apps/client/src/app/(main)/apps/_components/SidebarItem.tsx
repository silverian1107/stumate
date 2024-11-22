import type { LucideIcon } from 'lucide-react';
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Trash
} from 'lucide-react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  level?: number;
  active?: boolean;
  href?: string; // Để redirect
  id?: string;
  type?: 'Collection' | 'Note';
  isCreate?: boolean;
  expanded?: boolean;
  isButton?: boolean;
  onClick?: () => void;
  onExpand?: () => void;
}
const SidebarItem = ({
  id,
  href,
  label,
  icon: Icon,
  level = 0,
  expanded,
  active,
  type, // Add the type prop to SidebarItem (either 'Collection' or 'Note')
  isButton,
  // eslint-disable-next-line unused-imports/no-unused-vars
  isCreate,
  onClick,
  onExpand
}: SidebarItemProps) => {
  const CheveronIcon = expanded ? ChevronDown : ChevronRight;

  const handleExpand = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  return (
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
        <button
          type="button"
          className="h-full rounded-sm hover:bg-primary-100"
          onClick={handleExpand}
        >
          <CheveronIcon className="size-4 shrink-0" />
        </button>
      )}
      {isButton ? <Icon className="size-5" /> : <Icon className="size-4" />}

      <span className="truncate">{label}</span>

      {!!id && (
        <div className="ml-auto flex items-center gap-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ml-auto h-full rounded-sm text-black opacity-0 hover:bg-primary-100 group-hover:opacity-100"
              >
                <MoreHorizontal className="size-4 text-primary-900/60 hover:text-primary-900/80" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="bottom"
              forceMount
            >
              <DropdownMenuItem>
                <Trash className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-sm text-muted-foreground">
                Last edited: {new Date().toDateString()}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Conditional Plus Icon behavior based on type */}
          {type === 'Collection' ? (
            // If type === 'Collection', show dropdown for creating collection or note
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  role="button"
                  className="ml-auto h-full rounded-sm opacity-0 hover:bg-primary-100 group-hover:opacity-100"
                >
                  <Plus className="size-4 text-primary-900/50 hover:text-primary-900/80" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="start" side="bottom">
                <DropdownMenuItem onClick={() => {}}>
                  <Plus className="mr-2 size-4" />
                  Create Collection
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Plus className="mr-2 size-4" />
                  Create Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              type="button"
              onClick={() => {}}
              className="ml-auto h-full rounded-sm opacity-0 hover:bg-primary-100 group-hover:opacity-100"
            >
              <Plus className="size-4 text-primary-900/50 hover:text-primary-900/80" />
            </button>
          )}
        </div>
      )}
    </Link>
  );
};

export default SidebarItem;
