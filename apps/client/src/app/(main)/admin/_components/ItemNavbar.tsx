'use client';

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
  const pathname = usePathname(); // Lấy đường dẫn hiện tại
  const isActive = pathname === path;

  return (
    <div
      className="flex w-full gap-5 items-center  hover:bg-primary-700 hover:text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={path}
        className={isActive ? 'w-full p-3 bg-primary-300' : 'w-full p-3'}
      >
        <div>
          <div
            className={
              isOpen
                ? isActive
                  ? 'flex gap-2 size-full items-center font-semibold text-primary'
                  : 'flex gap-2 size-full items-center'
                : isActive
                  ? 'flex gap-2 size-full items-center justify-center font-semibold text-primary'
                  : 'flex gap-2 size-full items-center justify-center'
            }
          >
            {isOpen ? (
              <>
                <Icon
                  className="size-6"
                  color={
                    isActive || isHovered
                      ? '#fff'
                      : 'hsl(247 45.1% 20% / var(--tw-bg-opacity))'
                  }
                />
                <span
                  className={`${
                    isOpen
                      ? isActive || isHovered
                        ? 'font-bold text-white block'
                        : 'font-semibold text-md text-primary-950'
                      : isActive || isHovered
                        ? 'font-bold text-white hidden'
                        : 'font-bold text-primary-950'
                  }`}
                >
                  {label}
                </span>
              </>
            ) : (
              <Icon
                className="size-6"
                color={
                  isActive || isHovered
                    ? '#fff'
                    : 'hsl(247 45.1% 20% / var(--tw-bg-opacity))'
                }
              />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
export default ItemNavbar;
