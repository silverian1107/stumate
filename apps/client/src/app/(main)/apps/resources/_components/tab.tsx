'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const allTabs = [
  {
    id: 'flashcard',
    name: 'Flashcards',
    href: '/decks'
  },
  {
    id: 'quizz',
    name: 'Quizzes',
    href: '/quizzes'
  },
  {
    id: 'summary',
    name: 'Sumarry',
    href: '/summaries'
  }
];

export const SlidingTabBar = () => {
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(null);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const tabIndex = allTabs.findIndex((tab) => pathname.includes(tab.href));

    setActiveTabIndex(tabIndex);
  }, [pathname]);

  useEffect(() => {
    if (activeTabIndex === null) {
      return;
    }

    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeTabIndex] as HTMLElement;
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    };

    setTabPosition();
  }, [activeTabIndex]);

  return (
    <div className="relative flex rounded border border-primary-950/40 bg-primary-100 backdrop-blur-sm">
      <span
        className="absolute inset-y-0 -z-10 flex overflow-hidden transition-all duration-300"
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      >
        <span className="size-full rounded-sm bg-primary-600" />
      </span>
      {allTabs.map((tab, index) => {
        const isActive = activeTabIndex === index;

        return (
          <Link
            href={`/apps/resources/${tab.href}`}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            className={`${
              isActive ? `` : `hover:bg-primary-100`
            } ${isActive ? 'text-white' : 'text-primary-950'} my-auto h-full cursor-pointer select-none px-4 py-2 text-center font-light`}
            onClick={() => setActiveTabIndex(index)}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
};
