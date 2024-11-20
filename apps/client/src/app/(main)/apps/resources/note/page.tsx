import Link from 'next/link';

import Note from './Note';

interface Block {
  data: {
    text: string;
    level: number;
  };
  id: string;
  type: string;
}

interface Deck {
  user_id: string;
  blocks: Block[];
  time: string;
  category: string;
}

const initialDeck: Deck[] = [
  {
    user_id: 'abc123',
    blocks: [
      {
        data: {
          text: 'First note content',
          level: 2
        },
        id: '123_abc',
        type: 'header'
      }
    ],
    time: '2024-11-18 10:00 AM',
    category: 'Work'
  },
  {
    user_id: 'def456',
    blocks: [
      {
        data: {
          text: 'Second note content',
          level: 2
        },
        id: '124_def',
        type: 'header'
      }
    ],
    time: '2024-11-18 11:00 AM',
    category: 'Personal'
  },
  {
    user_id: 'ghi789',
    blocks: [
      {
        data: {
          text: 'Third note content',
          level: 2
        },
        id: '125_ghi',
        type: 'header'
      }
    ],
    time: '2024-11-18 12:00 PM',
    category: 'Misc'
  }
];

const Page: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="flex px-4 py-2 justify-between items-center">
        <p className="font-bold text-xl">All Notes</p>
        <Link
          href="/apps/resources/note/create"
          className="border rounded py-1 px-2 bg-slate-200"
        >
          Sort by...
        </Link>
      </div>
      {initialDeck.map((note) => (
        <Note
          key={note.user_id}
          content={note.blocks[0].data.text}
          time={note.time}
          category={note.category}
        />
      ))}
    </div>
  );
};

export default Page;
