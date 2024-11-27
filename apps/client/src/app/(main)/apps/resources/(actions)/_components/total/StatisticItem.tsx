import type { SvgIconProps } from '@mui/material';

const StatisticItem = ({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<SvgIconProps>;
  label: string;
  value: string | number;
}) => {
  return (
    <div className="element-total">
      <Icon color="primary" />
      <p className="text-primary-950 text-xs">{label}</p>
      <p className="text-gray-500 text-xs">{value}</p>
    </div>
  );
};

export default StatisticItem;
