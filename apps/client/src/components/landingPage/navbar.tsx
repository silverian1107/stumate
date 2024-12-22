'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import LoginStatus from '@/components/UserAccount';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 0);
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = ['Features', 'Benefits', 'About', 'Download'];

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-md' : ''
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="select-none text-3xl font-extrabold text-primary-700">
            StuMate
          </h1>
          <div className="hidden md:flex space-x-6">
            {navItems.map((text) => (
              <Link
                key={text}
                href={`/#${text.toLowerCase()}`}
                onClick={(e) => handleSmoothScroll(e, text.toLowerCase())}
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                {text}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <LoginStatus />
          </div>
        </div>
      </div>
    </nav>
  );
}
