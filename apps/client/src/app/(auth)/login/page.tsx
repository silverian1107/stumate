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
          <div className="flex items-center justify-center h-[1px] bg-black w-full relative">
            <span className="text-center bg-white px-2 text-sm">Or</span>
          </div>
          <div className="flex gap-2 text-[12px] leading-5 mt-5 justify-between w-full">
            <Link
              href=""
              className="flex gap-0.5 px-1 py-1 items-center justify-center grow border border-black/20 rounded"
            >
              <Apple className="text-gray-500" />
              <span className="text-black/60">Sign in with Apple</span>
            </Link>
            <Link
              href=""
              className="flex gap-0.5 px-1 py-1 items-center justify-center grow border border-black/20 rounded"
            >
              <GoogleIcon/>
              <span className="text-black/60">Sign in with Google</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
