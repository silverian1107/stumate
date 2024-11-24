import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssignmentIcon from '@mui/icons-material/Assignment';

const LowAccQuiz = () => {
  return (
    <div className="element-dashboard element">
      <div className="flex ">
        <p className="font-bold text-lg text-primary-950 mr-4">
          Low acc. quiz{' '}
        </p>
        <AssignmentIcon fontSize="small" sx={{ color: 'lightgray' }} />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold text-4xl  text-primary-500">2</p>
        <Link href="" className="px-1  text-xs text-gray-400">
          Go study <ArrowForwardIcon fontSize="small" />{' '}
        </Link>
      </div>
    </div>
  );
};

export default LowAccQuiz;
