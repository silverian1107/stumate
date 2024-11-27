import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import Link from 'next/link';

const CardDue = () => {
  return (
    <div className="element-dashboard element">
      <div className="flex ">
        <p className="font-bold text-sm text-primary-950 mr-4">
          Card Due Today{' '}
        </p>
        <AutoAwesomeMotionIcon fontSize="small" sx={{ color: 'lightgray' }} />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold text-4xl  text-primary-500">25:00</p>
        <Link href="" className="px-1  text-xs text-gray-400">
          Learn now <ArrowForwardIcon fontSize="small" />{' '}
        </Link>
      </div>
    </div>
  );
};

export default CardDue;
