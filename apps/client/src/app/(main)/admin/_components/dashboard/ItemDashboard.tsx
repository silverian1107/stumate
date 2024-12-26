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
      className="flex bg-white px-4 py-2 lg:p-4 rounded-lg flex-row justify-between items-start shadow hover:bg-primary-200  "
    >
      <div>
        <span className="font-bold text-[1.3vw] text-primary-950 ">
          {title}
        </span>
        <div className="flex gap-2 items-center lg:mt-3">
          <span className="font-bold text-[1.2vw] leading-7 text-primary-500">
            {value}
          </span>
          <span className="font-bold text-[1vw] leading-5 text-primary-500">
            {unit}
          </span>
        </div>
      </div>
      <div className="mt-1">
        <Icon className="lg:size-4 size-2 text-primary-950" />
      </div>
    </Link>
  );
};

export default ItemDashboard;
