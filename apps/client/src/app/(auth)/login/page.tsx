'use client';

import Link from 'next/link';

import SocialLogin from '@/components/SocialLogin';

// import { redirect, useRouter } from 'next/navigation';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center size-full flex-col gap-4 justify-evenly py-40">
      <p className="font-extrabold text-[3rem] text-primary-main -mb-10">
        Log in
      </p>
      <div className="bg-white p-8 rounded w-[380px] lg:w-[480px] border border-primary-main/40">
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
          <div className="flex items-center justify-center h-px bg-black w-full relative">
            <span className="text-center bg-white px-2 text-sm">Or</span>
          </div>
          <SocialLogin />
        </div>
      </div>
      <div />
    </div>
  );
}
