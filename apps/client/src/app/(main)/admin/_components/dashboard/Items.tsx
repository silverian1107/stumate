import { ClipboardList, Layers, NotepadText, UsersRound } from 'lucide-react';

import type { Overview } from '@/service/rootApi';

import ItemDashboard from './ItemDashboard';

const Items = ({ overview }: { overview: Overview }) => {
  return (
    <div className="grid grid-cols-4 gap-5">
      <ItemDashboard
        title="Accounts"
        value={overview.totalAccounts}
        unit={overview.totalAccounts > 1 ? 'Users' : 'User'}
        Icon={UsersRound}
        path="/admin/accounts"
      />
      <ItemDashboard
        title="Notes"
        value={overview.totalNotes}
        unit={overview.totalNotes > 1 ? 'Notes' : 'Note'}
        Icon={NotepadText}
        path="/admin/notes"
      />
      <ItemDashboard
        title="Flashcards"
        value={overview.totalFlashcards}
        unit={overview.totalFlashcards > 1 ? 'Flashcards' : 'Flashcard'}
        Icon={Layers}
        path="/admin/flashcards"
      />
      <ItemDashboard
        title="Quizzes"
        value={overview.totalQuizzes}
        unit={overview.totalQuizzes > 1 ? 'Quizzes' : 'Quiz'}
        Icon={ClipboardList}
        path="/admin/quizzes"
      />
    </div>
  );
};

export default Items;
