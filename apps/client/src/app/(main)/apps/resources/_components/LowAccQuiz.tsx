import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ClipboardList } from 'lucide-react';
import Link from 'next/link';

import IconDashboard from '../../../../../components/sidebar/IconDashboard';

const LowAccQuiz = ({
  quizzesCompletedToday = 0
}: {
  quizzesCompletedToday: number;
}) => {
  return (
    <div className="element-dashboard element">
      <div className="flex items-center ">
        <p className="font-bold text-lg text-primary-950 mr-4">
          Low acc. quiz{' '}
        </p>
        <IconDashboard icon={ClipboardList} />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold text-4xl  text-primary-500">
          {quizzesCompletedToday}
        </p>
        <Link href="" className="px-1  text-xs text-gray-400">
          Go study <ArrowForwardIcon fontSize="small" />{' '}
        </Link>
      </div>
    </div>
  );
};

export default LowAccQuiz;
