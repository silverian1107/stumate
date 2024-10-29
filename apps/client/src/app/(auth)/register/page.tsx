import Link from 'next/link';
import RegisterForm from './RegisterForm';
import { Apple } from '@mui/icons-material';

export default function RegisterPage() {
  return (
    <div className="flex justify-evenly items-center w-full h-full flex-col">
      <p className="font-extrabold text-[3rem] text-primary-main mt-20 -mb-20">
        Registration
      </p>
      <div className="bg-white px-8 py-8 rounded w-[380px] lg:w-[480px] border border-primary-main/40">
        <RegisterForm />
        <div className="flex flex-col items-center text-sm">
          <p className="mt-4 font-bold ">
            Have an account?{' '}
            <Link className="text-primary-main  font-semibold" href="/login">
              Sign in
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
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.037 6.69401H14.5V6.66634H8.50004V9.33301H12.2677C11.718 10.8853 10.241 11.9997 8.50004 11.9997C6.29104 11.9997 4.50004 10.2087 4.50004 7.99967C4.50004 5.79067 6.29104 3.99967 8.50004 3.99967C9.51971 3.99967 10.4474 4.38434 11.1537 5.01267L13.0394 3.12701C11.8487 2.01734 10.256 1.33301 8.50004 1.33301C4.81837 1.33301 1.83337 4.31801 1.83337 7.99967C1.83337 11.6813 4.81837 14.6663 8.50004 14.6663C12.1817 14.6663 15.1667 11.6813 15.1667 7.99967C15.1667 7.55267 15.1207 7.11634 15.037 6.69401Z"
                  fill="#FFC107"
                  fillOpacity="0.6"
                />
                <path
                  d="M2.60205 4.89667L4.79238 6.50301C5.38505 5.03567 6.82038 3.99967 8.50005 3.99967C9.51972 3.99967 10.4474 4.38434 11.1537 5.01267L13.0394 3.12701C11.8487 2.01734 10.2561 1.33301 8.50005 1.33301C5.93938 1.33301 3.71872 2.77867 2.60205 4.89667Z"
                  fill="#FF3D00"
                  fillOpacity="0.6"
                />
                <path
                  d="M8.50006 14.6662C10.2221 14.6662 11.7867 14.0072 12.9697 12.9355L10.9064 11.1895C10.2371 11.6965 9.40506 11.9995 8.50006 11.9995C6.76606 11.9995 5.29373 10.8938 4.73906 9.35083L2.56506 11.0258C3.6684 13.1848 5.90906 14.6662 8.50006 14.6662Z"
                  fill="#4CAF50"
                  fillOpacity="0.6"
                />
                <path
                  d="M15.037 6.69417H14.5V6.6665H8.5V9.33317H12.2677C12.0037 10.0788 11.524 10.7218 10.9053 11.1902L10.9063 11.1895L12.9697 12.9355C12.8237 13.0682 15.1667 11.3332 15.1667 7.99984C15.1667 7.55284 15.1207 7.1165 15.037 6.69417Z"
                  fill="#1976D2"
                  fillOpacity="0.6"
                />
              </svg>
              <span className="text-black/60">Sign in with Google</span>
            </Link>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
