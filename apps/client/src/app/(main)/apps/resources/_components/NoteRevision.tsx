import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { BookText } from 'lucide-react';
import Link from 'next/link';

import IconDashboard from '../../../../../components/sidebar/IconDashboard';

const NoteRevision = ({
  notesRevisedTodayCount = 0
}: {
  notesRevisedTodayCount: number;
}) => {
  return (
    <div className="element-dashboard element">
      <div className="flex items-center ">
        <p className="font-bold text-lg text-primary-950 mr-4">
          Share Resource{' '}
        </p>
        <IconDashboard icon={BookText} />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold text-4xl  text-primary-500">
          {notesRevisedTodayCount}
        </p>
        <Link href="" className=" text-xs text-gray-400">
          Let&apos;s Revision{' '}
          <ArrowForwardIcon fontSize="small" sx={{ color: 'lightgray' }} />{' '}
        </Link>
      </div>
    </div>
  );
};

export default NoteRevision;
