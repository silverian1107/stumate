import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export default function AuthLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative flex h-screen w-screen items-center justify-center bg-[linear-gradient(114.55deg,#A6B1FB_0%,#C8CFFD_54.88%,#8BFFF5_100%)] font-[family-name:var(--font-lexend-deca)]">
      <div className="absolute left-24 top-11  flex size-14 cursor-pointer items-center justify-center rounded-full bg-purple-100/50 !text-primary-main hover:bg-purple-100/20">
        <Link href="/">
          <ArrowBack
            className="flex items-center justify-center"
            sx={{ fontSize: '30px' }}
          />
        </Link>
      </div>
      <div className="size-full ">{children}</div>
    </main>
  );
}

/* Frame 1000003471 */
