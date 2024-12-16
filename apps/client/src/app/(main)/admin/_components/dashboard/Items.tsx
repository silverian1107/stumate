import { ClipboardList, Layers, NotepadText, UsersRound } from 'lucide-react';

import ItemDashboard from './ItemDashboard';

const Items = () => {
  return (
    <div className="grid grid-cols-4 gap-5">
      <ItemDashboard
        title="Accounts"
        value={12}
        unit={12 > 0 ? 'users' : 'user'}
        Icon={UsersRound}
        path="/admin/accounts"
      />
      <ItemDashboard
        title="Notes"
        value={14}
        unit="note"
        Icon={NotepadText}
        path="/admin/notes"
      />
      <ItemDashboard
        title="Flashcards"
        value={20}
        unit="Flashcards"
        Icon={Layers}
        path="/admin/flashcards"
      />
      <ItemDashboard
        title="Quizzes"
        value={20}
        unit="Quizzes"
        Icon={ClipboardList}
        path="/admin/quizzes"
      />
    </div>
  );
};

export default Items;
