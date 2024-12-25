'use client';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Archive,
  ArchiveX,
  Bell,
  CircleUserRound,
  ClipboardList,
  FileClock,
  House,
  Layers,
  NotepadText,
  Tag
} from 'lucide-react';
import React, { useState } from 'react';

import ItemNavbar from './ItemNavbar';

interface NavbarAdminProps {
  isOpen: boolean;
}

const NavbarAdmin = ({ isOpen }: NavbarAdminProps) => {
  const [openSubmenuResources, setOpenSubmenuResources] = useState(false);
  const [openSubmenuAr, setOpenSubmenuAr] = useState(false);

  const handleSubmenuClick = () => {
    setOpenSubmenuResources(!openSubmenuResources);
  };
  const handleSubmenuArClick = () => {
    setOpenSubmenuAr(!openSubmenuAr);
  };
  return (
    <div className="size-full py-10 bg-primary-100 border-r border-gray-200 font-bold">
      <List
        component="nav"
        sx={{
          color: 'hsl(247 45.1% 20% / var(--tw-text-opacity))',
          fontSize: '16px',
          fontWeight: 700
        }}
      >
        <ItemNavbar Icon={House} isOpen={isOpen} label="Home" path="/admin" />
        <ItemNavbar
          Icon={CircleUserRound}
          isOpen={isOpen}
          label="Manage Accounts"
          path="/admin/accounts"
        />
        <ItemNavbar
          Icon={FileClock}
          isOpen={isOpen}
          label="Manage Logs"
          path="/admin/logs"
        />
        <ListItemButton
          onClick={handleSubmenuClick}
          className="hover:bg-gray-200"
          sx={{ py: '8px' }}
        >
          <ListItemIcon
            sx={{
              minWidth: '32px',
              marginRight: '4px'
            }}
          >
            <Archive
              className="size-5"
              color="hsl(247 45.1% 20% / var(--tw-bg-opacity))"
            />
          </ListItemIcon>
          {isOpen && (
            <ListItemText
              primary="Manage Resources"
              sx={{ '& span': { fontSize: '16px' } }}
            />
          )}
          {isOpen && (openSubmenuResources ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        <Collapse in={openSubmenuResources} timeout="auto" unmountOnExit>
          <ul className="pl-8">
            <li>
              <ItemNavbar
                Icon={NotepadText}
                isOpen={isOpen}
                label="Manage Notes"
                path="/admin/notes"
              />
            </li>
            <li>
              <ItemNavbar
                Icon={Layers}
                isOpen={isOpen}
                label="Manage Flashcards"
                path="/admin/flashcards"
              />
            </li>
            <li>
              <ItemNavbar
                Icon={ClipboardList}
                isOpen={isOpen}
                label="Manage Quizzes"
                path="/admin/quizzes"
              />
            </li>
          </ul>
        </Collapse>
        <ItemNavbar
          Icon={Tag}
          isOpen={isOpen}
          label="Manage Tags"
          path="/admin/tags"
        />
        <ItemNavbar
          Icon={Bell}
          isOpen={isOpen}
          label="Manage Notifications"
          path="/admin/notifications"
        />
        <ListItemButton
          onClick={handleSubmenuArClick}
          className="hover:bg-gray-200"
          sx={{ py: '8px' }}
        >
          <ListItemIcon
            sx={{
              minWidth: '32px',
              marginRight: '4px'
            }}
          >
            <ArchiveX
              className="size-5"
              color="hsl(247 45.1% 20% / var(--tw-bg-opacity))"
            />
          </ListItemIcon>
          {isOpen && (
            <ListItemText
              primary="Archived"
              sx={{ '& span': { fontSize: '16px' } }}
            />
          )}
          {isOpen && (openSubmenuAr ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        <Collapse in={openSubmenuAr} timeout="auto" unmountOnExit>
          <ul className="pl-8">
            <li>
              <ItemNavbar
                Icon={NotepadText}
                isOpen={isOpen}
                label="Manage Notes"
                path="/admin/archive/notes"
              />
            </li>
            <li>
              <ItemNavbar
                Icon={Layers}
                isOpen={isOpen}
                label="Manage Flashcards"
                path="/admin/archive/flashcards"
              />
            </li>
            <li>
              <ItemNavbar
                Icon={ClipboardList}
                isOpen={isOpen}
                label="Manage Quizzes"
                path="/admin/archive/quizzes"
              />
            </li>
          </ul>
        </Collapse>
      </List>
    </div>
  );
};
export default NavbarAdmin;
