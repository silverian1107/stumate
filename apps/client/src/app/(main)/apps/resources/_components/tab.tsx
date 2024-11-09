'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const allTabs = [
  {
    id: 'flashcard',
    name: 'Flashcards',
    href: '/cards',
  },
  {
    id: 'quizz',
    name: 'Quizzes',
    href: '/quizzes',
  },
  {
    id: 'summary',
    name: 'Sumarry',
    href: '/summaries',
  },
];

export const SlidingTabBar = () => {
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(null);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const activeTabIndex = allTabs.findIndex((tab) =>
      pathname.includes(tab.href),
    );

    setActiveTabIndex(activeTabIndex);
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
        className="absolute bottom-0 top-0 -z-10 flex overflow-hidden transition-all duration-300"
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      >
        <span className="h-full w-full rounded-sm bg-primary-600" />
      </span>
      {allTabs.map((tab, index) => {
        const isActive = activeTabIndex === index;

        return (
          <Link
            href={`/apps/resources/` + tab.href}
            key={index}
            ref={(el) => {
              tabsRef.current[index] = el;
              return;
            }}
            className={`${
              isActive ? `` : `hover:bg-primary-100`
            } ${isActive ? 'text-white' : 'text-primary-950'} my-auto cursor-pointer select-none px-4 text-center font-light h-full py-2`}
            onClick={() => setActiveTabIndex(index)}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
};
