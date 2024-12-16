'use client';

import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const ItemNavbar = ({
  label,
  path,
  isOpen,
  Icon
}: {
  label: string;
  path: string;
  isOpen: boolean;
  Icon: LucideIcon;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  return (
    <Link href={path}>
      <ListItemButton
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={
          pathname === path
            ? '!bg-primary-300 !text-white !font-bold'
            : 'hover:!bg-primary-700 hover:!text-white'
        }
        sx={{ py: '8px' }}
      >
        <ListItemIcon
          sx={{
            minWidth: '32px',
            marginRight: '4px'
          }}
        >
          <Icon
            className="size-5"
            color={
              pathname === path || isHovered
                ? '#fff'
                : 'hsl(247 45.1% 20% / var(--tw-bg-opacity))'
            }
          />
        </ListItemIcon>
        {isOpen && <ListItemText primary={label} />}
      </ListItemButton>
    </Link>
  );
};
export default ItemNavbar;
