import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-screen w-screen relative items-center justify-center bg-[linear-gradient(114.55deg,#A6B1FB_0%,#C8CFFD_54.88%,#8BFFF5_100%)] font-[family-name:var(--font-lexend-deca)]">
      <div className="absolute top-11 left-24  rounded-full w-14 h-14 flex justify-center items-center bg-purple-100/50 hover:bg-purple-100/20 cursor-pointer !text-primary-main">
        <Link href="/">
          <ArrowBack
            className="flex justify-center items-center"
            sx={{ fontSize: '30px' }}
          />
        </Link>
      </div>
      <div className="w-full h-full">{children}</div>
    </main>
  );
}

/* Frame 1000003471 */
