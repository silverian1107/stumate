'use client';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useAccount } from '@/hooks/use-auth';

import Sidebar from './_components/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
        <main className="flex-1 bg-primary-50 relative">{children}</main>
      </div>
    </LocalizationProvider>
  );
}
