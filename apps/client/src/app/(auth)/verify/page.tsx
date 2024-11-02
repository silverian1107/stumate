import VerifyOTPForm from './VerifyOTPForm';

export default function RegisterPage() {
  return (
    <div className="flex items-center w-full h-full flex-col gap-4 justify-evenly py-20">
      <p className="font-extrabold text-[3rem] text-primary-main -mb-20">
        Verify OTP
      </p>
      <div className="bg-white px-8 py-8 rounded w-[380px] lg:w-[480px] border border-primary-main/40">
        <VerifyOTPForm />
      </div>
      <div />
    </div>
  );
}
