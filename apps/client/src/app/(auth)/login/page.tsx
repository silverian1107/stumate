import Link from 'next/link';
import LoginForm from './LoginForm';
import { Apple } from '@mui/icons-material';
import GoogleIcon from '@/access/GoogleIcon';

export default function LoginPage() {
  return (
    <div className="flex  items-center w-full h-full flex-col gap-4">
      <p className="font-extrabold text-[3rem] text-primary-main mt-10  ">
        Log in
      </p>
      <div className="bg-white px-8 py-8 rounded w-[380px] lg:w-[480px] border border-primary-main/40">
        <LoginForm />
        <div className="flex flex-col items-center text-sm">
          <p className="mt-4 font-bold ">
            If you don&apos;t have an account?{' '}
            <Link className="text-primary-main font-semibold" href="/register">
              Sign up here
            </Link>
          </p>
        </div>
        <div className="mt-5">
          <div className="h-[1px] border flex items-center justify-center">
            <span className="text-[12px] px-[10px]  bg-white">Or</span>
          </div>
          <div className="flex gap-2 text-[12px] leading-5 mt-5 justify-between">
            <div className="flex gap-0.5 border px-1 py-1 rounded-sm items-center">
              <Apple />
              <Link href="">Sign in with Apple</Link>
            </div>
            <div className="flex gap-0.5 border px-1  rounded-sm items-center">
              <GoogleIcon />
              <Link href="">Sign in with Google</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
