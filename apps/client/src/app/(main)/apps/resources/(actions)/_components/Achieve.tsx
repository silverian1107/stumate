import Link from 'next/link';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Achieve = () => {
  return (
    <div className="element-dashboard element">
      <div className="flex ">
        <p className="font-bold text-lg text-primary-950 mr-4">
          Achieve your goal{' '}
        </p>
        <FlagCircleIcon fontSize="small" sx={{ color: 'lightgray' }} />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <div className=" grid grid-cols-2 gap-x-8 gap-y-1  ">
          <div className="flex gap-1 justify-center items-center">
            <p className="text-primary-500 font-bold text-base">15</p>
            <p className="text-xs text-gray-400">cards</p>
          </div>
          <div className="flex gap-1 justify-center items-center">
            <p className="text-primary-500 font-bold text-base">2</p>
            <p className="text-xs text-gray-400">quizzes</p>
          </div>
          <div className="flex gap-1 justify-center items-center">
            <p className="text-primary-500 font-bold text-base">2K</p>
            <p className="text-xs text-gray-400">words</p>
          </div>
          <div className="flex gap-1 justify-center items-center">
            <p className="text-primary-500 font-bold text-base">{`>`}80%</p>
            <p className="text-xs text-gray-400">acc</p>
          </div>
        </div>
        <Link href="" className="px-1  text-xs text-gray-400">
          Learn now <ArrowForwardIcon fontSize="small" />{' '}
        </Link>
      </div>
    </div>
  );
};

export default Achieve;
