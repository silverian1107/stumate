import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Target } from 'lucide-react';
import Link from 'next/link';

import IconDashboard from '../../../_components/IconDashboard';

const Achieve = ({
  flashcardsCompletedToday = 0,
  flashcardMasteryProgressToday = 0,
  quizzesCompletedToday = 0,
  accuracyRateToday = 0
}: {
  flashcardsCompletedToday: number;
  flashcardMasteryProgressToday: number;
  quizzesCompletedToday: number;
  accuracyRateToday: number;
}) => {
  return (
    <div className="element-dashboard element">
      <div className="flex items-center ">
        <p className="font-bold text-lg text-primary-950 mr-4">
          Achieve your goal{' '}
        </p>
        <IconDashboard icon={Target} />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <div className=" grid grid-cols-2 gap-x-8 gap-y-1  ">
          <div className="flex gap-1 justify-center items-center">
            <p className="text-primary-500 font-bold text-base">
              {flashcardsCompletedToday}
            </p>
            <p className="text-xs text-gray-400">
              {flashcardsCompletedToday > 0 ? 'cards' : 'card'}
            </p>
          </div>
          <div className="flex gap-1 justify-center items-center">
            <p className="text-primary-500 font-bold text-base">
              {quizzesCompletedToday}
            </p>
            <p className="text-xs text-gray-400">
              {quizzesCompletedToday > 0 ? 'quizzes' : 'quiz'}
            </p>
          </div>
          <div className="flex gap-1 justify-center items-center">
            <p className="text-primary-500 font-bold text-base">
              {flashcardMasteryProgressToday / 1000 > 0
                ? `${flashcardMasteryProgressToday / 1000}K`
                : `${flashcardMasteryProgressToday}`}
            </p>
            <p className="text-xs text-gray-400">words</p>
          </div>
          <div className="flex gap-1 justify-center items-center">
            <p className="text-primary-500 font-bold text-base">{`${accuracyRateToday}%`}</p>
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
