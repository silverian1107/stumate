import {
  BookOpenCheck,
  BookPlus,
  Clock,
  Flame,
  NotebookText,
  Target
} from 'lucide-react';
import React from 'react';

import type { IUserStatistic } from '@/service/rootApi';

import EachPerfrom from './EachPerform';

const DetailPerform = ({ statistics }: { statistics: IUserStatistic }) => {
  return (
    <div className="flex gap-10 justify-between mt-3 ">
      <EachPerfrom
        value={
          statistics.data?.studyStreakDays > 1
            ? `${statistics.data?.studyStreakDays} days`
            : `${statistics.data?.studyStreakDays} day`
        }
        label="Streak"
        icon={Flame}
      />
      <EachPerfrom
        value={
          statistics.data?.sessionsThisWeek > 1
            ? `${statistics.data?.sessionsThisWeek} sessions`
            : `${statistics.data?.sessionsThisWeek} session`
        }
        label="This Week"
        icon={BookOpenCheck}
      />
      <EachPerfrom
        value={
          statistics.data?.flashcardsDueTodayCount > 1
            ? `${statistics.data?.flashcardsDueTodayCount} cards`
            : `${statistics.data?.flashcardsDueTodayCount} card`
        }
        label="New Terms"
        icon={BookPlus}
      />
      <EachPerfrom
        value={
          statistics.data?.flashcardsCompletedToday > 1
            ? `${statistics.data?.flashcardsCompletedToday} cards`
            : `${statistics.data?.flashcardsCompletedToday} card`
        }
        label="Studied"
        icon={NotebookText}
      />
      <EachPerfrom
        value={`${statistics.data?.accuracyRate} %`}
        label="Accuracy"
        icon={Target}
      />
      <EachPerfrom value="4.6 hrs" label="Total of" icon={Clock} />
    </div>
  );
};

export default DetailPerform;
