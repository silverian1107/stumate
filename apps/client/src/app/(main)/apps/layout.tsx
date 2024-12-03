'use client';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useAccount } from '@/hooks/use-auth';

import Sidebar from './_components/Sidebar';

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const { isLoading } = useAccount();

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">Loading</div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="size-full relative flex text-sm">
        <Sidebar />
        <main className="flex-1 bg-primary-50 flex justify-center px-6 py-8 ">
          {children}
        </main>
      </div>
    </LocalizationProvider>
  );
}
