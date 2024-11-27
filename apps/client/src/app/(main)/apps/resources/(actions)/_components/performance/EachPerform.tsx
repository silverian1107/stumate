import type { SvgIconProps } from '@mui/material';

const EachPerfrom = ({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<SvgIconProps>;
  label: string;
  value: string | number;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <p className="text-sm font-semibold text-primary-950 mr-2 ">{label}</p>
        <Icon fontSize="small" className="text-gray-400 border rounded-full" />
      </div>
      <p className="text-xs  text-gray-400">{value}</p>
    </div>
  );
};

export default EachPerfrom;
