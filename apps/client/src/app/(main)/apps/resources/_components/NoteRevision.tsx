import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArticleIcon from '@mui/icons-material/Article';
import Link from 'next/link';

const NoteRevision = () => {
  return (
    <div className="element-dashboard element">
      <div className="flex ">
        <p className="font-bold text-lg text-primary-950 mr-4">
          Note Revision{' '}
        </p>
        <ArticleIcon fontSize="small" sx={{ color: 'lightgray' }} />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold text-4xl  text-primary-500">2</p>
        <Link href="" className=" text-xs text-gray-400">
          Let&apos;s Revision{' '}
          <ArrowForwardIcon fontSize="small" sx={{ color: 'lightgray' }} />{' '}
        </Link>
      </div>
    </div>
  );
};

export default NoteRevision;
