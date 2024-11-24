import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from '@/components/ui/button';

const ShortSession = () => {
  return (
    <div className="element-dashboard element">
      <div className="flex text-xs">
        <p className="font-bold text-primary-950 mr-1">Short session </p>
        <p className="text-gray-500 mr-7">Long Break</p>
        <MoreHorizIcon fontSize="small" />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <div className="relative">
          <p className="font-bold text-4xl text-primary-500">25:00</p>
          <RefreshIcon
            fontSize="small"
            color="primary"
            className="absolute top-[10px] right-[-25px]"
          />
        </div>
        <Button size="sm">Start</Button>
      </div>
    </div>
  );
};

export default ShortSession;
