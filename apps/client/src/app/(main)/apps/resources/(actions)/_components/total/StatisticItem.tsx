import type { LucideIcon } from 'lucide-react';

import IconWrapper from '@/app/(main)/apps/_components/IconWrapper';

const StatisticItem = ({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon; // Sửa kiểu icon để tương thích với LucideProps
  label: string;
  value: string | number;
}) => {
  return (
    <div className="element-total">
      <IconWrapper icon={Icon} />
      <p className="text-primary-950 text-xs">{label}</p>
      <p className="text-gray-500 text-xs">{value}</p>
    </div>
  );
};

export default StatisticItem;
