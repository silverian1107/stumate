'use client';

import { useAccount } from '@/hooks/use-auth';
import Sidebar from './_components/Sidebar';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isLoading } = useAccount();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex text-sm">
      <Sidebar />
      <main className="flex-1 bg-primary-50">{children}</main>
    </div>
  );
}
