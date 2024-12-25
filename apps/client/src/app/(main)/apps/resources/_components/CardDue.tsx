import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Layers3 } from 'lucide-react';
import Link from 'next/link';

import IconDashboard from '../../../../../components/sidebar/IconDashboard';

const CardDue = ({
  flashcardsDueTodayCount = 0
}: {
  flashcardsDueTodayCount: number;
}) => {
  return (
    <div className="element-dashboard element">
      <div className="flex ">
        <p className="font-bold text-sm text-primary-950 mr-4">
          Card Due Today{' '}
        </p>
        <IconDashboard icon={Layers3} />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold text-4xl  text-primary-500">
          {flashcardsDueTodayCount}
        </p>
        <Link href="" className="px-1  text-xs text-gray-400">
          Learn now <ArrowForwardIcon fontSize="small" />{' '}
        </Link>
      </div>
    </div>
  );
};

export default CardDue;
