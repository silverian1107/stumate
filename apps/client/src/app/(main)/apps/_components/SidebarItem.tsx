import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
  onClick,
  onExpand,
}: SidebarItemProps) => {
  const CheveronIcon = expanded ? ChevronDown : ChevronRight;

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  return (
    <Link
      href={href ? href : '#'}
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
          : 'hover:bg-primary-200 py-1.5',
      )}
      style={{
        paddingLeft: level ? `${level * 8 + 12}px` : '12px',
      }}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-primary-100"
          onClick={handleExpand}
        >
          <CheveronIcon className="h-4 w-4 shrink-0" />
        </div>
      )}
      {isButton ? <Icon className="w-5 h-5" /> : <Icon className="w-4 h-4" />}

      <span className="truncate">{label}</span>

      {!!id && (
        <div className="ml-auto flex items-center gap-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-primary-100 text-black"
              >
                <MoreHorizontal className="h-4 w-4 text-primary-900/60 hover:text-primary-900/80" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="bottom"
              forceMount
            >
              <DropdownMenuItem>
                <Trash className="h-4 w-4 mr-2" />
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
                  className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-primary-100"
                >
                  <Plus className="h-4 w-4 text-primary-900/50 hover:text-primary-900/80" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="start" side="bottom">
                <DropdownMenuItem onClick={() => {}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Collection
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div
              role="button"
              onClick={() => {}}
              className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-primary-100"
            >
              <Plus className="h-4 w-4 text-primary-900/50 hover:text-primary-900/80" />
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

export default SidebarItem;
