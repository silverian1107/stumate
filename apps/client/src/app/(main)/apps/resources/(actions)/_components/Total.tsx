import { Avatar } from '@mui/material';
import {
  BookText,
  ClipboardList,
  Flame,
  Layers3,
  PencilLine,
  Target
} from 'lucide-react';

import StatisticItem from './total/StatisticItem';

const Total = ({
  username,
  totalNotesCount = 0,
  totalFlashcardsCount = 0,
  totalQuizzesCount = 0,
  dailyStudyDuration = 0,
  studyStreakDays = 0,
  accuracyRate = 0
}: {
  username: string;
  totalNotesCount: number;
  totalFlashcardsCount: number;
  totalQuizzesCount: number;
  dailyStudyDuration: number;
  studyStreakDays: number;
  accuracyRate: number;
}) => {
  return (
    <div className="flex flex-col bg-white rounded-lg h-fit">
      <div className="flex flex-col justify-center items-center w-full py-3 ">
        <Avatar className="!bg-primary-main">
          {username[0]?.toUpperCase()}
        </Avatar>
        <p className="text-lg">{username}</p>
      </div>
      <div className="grid grid-cols-2 w-full">
        <StatisticItem
          icon={Flame}
          label="Best Streak"
          value={
            studyStreakDays > 1
              ? `${studyStreakDays} days`
              : `${studyStreakDays} day`
          }
        />
        <StatisticItem
          icon={BookText}
          label="Total Notes"
          value={totalNotesCount}
        />
        <StatisticItem
          icon={Layers3}
          label="Total Flashcards"
          value={totalFlashcardsCount}
        />
        <StatisticItem
          icon={ClipboardList}
          label="Total Quizzes"
          value={totalQuizzesCount}
        />
        <StatisticItem
          icon={PencilLine}
          label="Daily Study Time"
          value={
            dailyStudyDuration > 1
              ? `${dailyStudyDuration} hours`
              : `${dailyStudyDuration} hour`
          }
        />
        <StatisticItem
          icon={Target}
          label="Accurracy"
          value={`${accuracyRate}%`}
        />
      </div>
    </div>
  );
};

export default Total;
