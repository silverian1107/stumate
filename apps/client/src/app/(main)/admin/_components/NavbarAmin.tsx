import {
  CircleUserRound,
  ClipboardList,
  FileClock,
  House,
  Layers,
  NotepadText
} from 'lucide-react';
import React from 'react';

import ItemNavbar from './ItemNavbar';

const NavbarAdmin = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="size-full py-10 bg-primary-100  border-r border-gray-200">
      <div className="w-full">
        <ItemNavbar label="Home" path="/admin" Icon={House} isOpen={isOpen} />
        <ItemNavbar
          label="Manage Account"
          Icon={CircleUserRound}
          path="/admin/accounts"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Manage Logs"
          Icon={FileClock}
          path="/admin/logs"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Manage Notes"
          Icon={NotepadText}
          path="/admin/notes"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Manage Flashcards"
          Icon={Layers}
          path="/admin/flashcards"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Manage Quizzes"
          Icon={ClipboardList}
          path="/admin/quizzes"
          isOpen={isOpen}
        />
      </div>
    </div>
  );
};

export default NavbarAdmin;
