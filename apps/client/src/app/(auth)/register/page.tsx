import Link from 'next/link';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <div>
      <p className="text-2xl mb-5 font-bold text-center ">Register</p>
      <RegisterForm />
      <p className="mt-4">
        Already have an account?{' '}
        <Link className="text-sky-600" href="/login">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
