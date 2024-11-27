import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Avatar } from '@mui/material';

import StatisticItem from './total/StatisticItem';

const Total = ({ username }: { username: string }) => {
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
          icon={LocalFireDepartmentIcon}
          label="Best Streak"
          value="64 days"
        />
        <StatisticItem icon={ArticleIcon} label="Total Notes" value="212" />
        <StatisticItem
          icon={AutoAwesomeMotionIcon}
          label="Total Flashcards"
          value="200"
        />
        <StatisticItem
          icon={AssignmentIcon}
          label="Total Quizzes"
          value="100"
        />
        <StatisticItem
          icon={BorderColorIcon}
          label="Daily Study Time"
          value="64 days"
        />
        <StatisticItem icon={FlagCircleIcon} label="Accurracy" value="65%" />
      </div>
    </div>
  );
};

export default Total;
