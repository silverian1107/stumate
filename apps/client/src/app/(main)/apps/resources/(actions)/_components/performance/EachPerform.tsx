import type { LucideIcon } from 'lucide-react';

import IconDashboard from '@/components/sidebar/IconDashboard';

const EachPerfrom = ({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <p className="text-sm font-semibold text-primary-950 mr-2 ">{label}</p>
        <IconDashboard icon={Icon} />
      </div>
      <p className="text-xs  text-gray-400">{value}</p>
    </div>
  );
};

export default EachPerfrom;
