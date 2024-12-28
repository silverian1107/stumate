import { Facebook } from '@mui/icons-material';
import Link from 'next/link';

import GoogleIcon from '@/access/GoogleIcon';

import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="flex size-full flex-col items-center justify-evenly gap-4 py-20 md:py-40">
      <p className="xl:-mb-10 text-[3rem] font-extrabold text-primary-main">
        Log in
      </p>
      <div className="w-[380px] rounded border border-primary-main/40 bg-white p-8 lg:w-[480px]">
        <LoginForm />
        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary-main hover:underline focus:underline focus:outline-none"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="flex flex-col items-center text-sm">
          <p className="mt-4 font-bold ">
            If you don&apos;t have an account?{' '}
            <Link className="font-semibold text-primary-main" href="/register">
              Sign up here
            </Link>
          </p>
        </div>
        <div className="mt-5">
          <div className="relative flex h-px w-full items-center justify-center bg-black">
            <span className="bg-white px-2 text-center text-sm">Or</span>
          </div>
          <div className="mt-5 flex w-full justify-between gap-2 text-[12px] leading-5">
            <Link
              href=""
              className="flex grow items-center justify-center gap-0.5 rounded border border-black/20 p-1"
            >
              <Facebook className="text-gray-500" />
              <span className="text-black/60">Sign in with Facebook</span>
            </Link>
            <Link
              href=""
              className="flex grow items-center justify-center gap-0.5 rounded border border-black/20 p-1"
            >
              <GoogleIcon />
              <span className="text-black/60">Sign in with Google</span>
            </Link>
          </div>
        </div>
      </div>
      <div />
    </div>
  );
}
