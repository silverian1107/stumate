import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}
const SidebarItem = ({
  label,
  icon: Icon,
  active,
  onClick,
}: SidebarItemProps) => {
  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        'flex font-medium px-4 hover:bg-primary-800 hover:text-white',
        active && 'bg-primary-200',
      )}
    >
      <div className="flex gap-2 py-4">
        <Icon className="w-6 h-6" />
        {label}
      </div>
    </div>
  );
};

export default SidebarItem;
