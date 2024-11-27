
import React from 'react';

import EachPerfrom from './EachPerform';
import {
  BookOpenCheck,
  BookPlus,
  Clock,
  Flame,
  NotebookText,
  Target
} from 'lucide-react';

const DetailPerform = () => {
  return (
    <div className="flex gap-10 justify-between mt-3 ">
      <EachPerfrom value="18 days" label="Streak" icon={Flame} />
      <EachPerfrom value="15 sessions" label="This Week" icon={BookOpenCheck} />
      <EachPerfrom value="40 cards" label="New Terms" icon={BookPlus} />
      <EachPerfrom value="35 cards" label="Studied" icon={NotebookText} />
      <EachPerfrom value="95%" label="Accuracy" icon={Target} />
      <EachPerfrom value="4.6 hrs" label="Toatl of" icon={Clock} />
    </div>
  );
};

export default DetailPerform;
