'use client';

import { useState } from 'react';

import HeadingAdmin from './_components/HeadingAdmin';
import NavbarAdmin from './_components/NavbarAmin';

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="size-full relative text-sm flex flex-col">
      <HeadingAdmin handleToggleNavbar={handleToggleNavbar} />
      <div className="flex bg-primary-50 flex-1 h-[calc(100vh-64px)]">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? 'w-1/5' : 'w-[6%]'
          }`}
        >
          <NavbarAdmin isOpen={isOpen} />
        </div>
        <div
          className={`transition-all duration-300 flex-1 h-full ${
            isOpen ? 'w-4/5' : 'w-[94%]'
          }`}
        >
          <main className="flex-1 bg-primary-50 size-full flex justify-center items-center p-6">
            {children}
          </main>
        </div>
      </div>
      {/* <main className="flex-1 bg-primary-50">{children}</main> */}
    </div>
  );
}
