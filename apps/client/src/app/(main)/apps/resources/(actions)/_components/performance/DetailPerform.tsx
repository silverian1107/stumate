import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import React from 'react';

import EachPerfrom from './EachPerform';

const DetailPerform = () => {
  return (
    <div className="flex gap-10 justify-between mt-3 ">
      <EachPerfrom
        value="18 days"
        label="Streak"
        icon={LocalFireDepartmentIcon}
      />
      <EachPerfrom
        value="15 sessions"
        label="This Week"
        icon={CheckCircleIcon}
      />
      <EachPerfrom value="40 cards" label="New Terms" icon={AddCircleIcon} />
      <EachPerfrom value="35 cards" label="Studied" icon={AutoStoriesIcon} />
      <EachPerfrom value="95%" label="Accuracy" icon={FlagCircleIcon} />
      <EachPerfrom value="4.6 hrs" label="Toatl of" icon={AccessTimeIcon} />
    </div>
  );
};

export default DetailPerform;
