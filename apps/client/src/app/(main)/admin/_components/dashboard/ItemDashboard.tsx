import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

const ItemDashboard = ({
  title,
  value,
  Icon,
  unit,
  path
}: {
  title: string;
  value: number;
  Icon: LucideIcon;
  unit: string;
  path: string;
}) => {
  return (
    <Link
      href={path}
      className="relative flex bg-white p-4 rounded-lg flex-row justify-between items-start shadow hover:bg-primary-200   "
    >
      <div>
        <span className="font-bold text-xl text-primary-950 mr-4">{title}</span>
        <div className="flex gap-2 items-center">
          <span className="font-bold text-lg text-primary-500">{value}</span>
          <span className="font-bold text-sm text-primary-500">{unit}</span>
        </div>
      </div>
      <div className="mt-1">
        <Icon className="size-4 text-primary-950" />
      </div>
    </Link>
  );
};

export default ItemDashboard;
