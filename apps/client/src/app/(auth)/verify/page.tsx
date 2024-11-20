import VerifyOTPForm from './VerifyOTPForm';

export default function RegisterPage() {
  return (
    <div className="flex size-full flex-col items-center justify-evenly gap-4 py-20">
      <p className="-mb-20 text-[3rem] font-extrabold text-primary-main">
        Verify OTP
      </p>
      <div className="w-[380px] rounded border border-primary-main/40 bg-white p-8 lg:w-[480px]">
        <VerifyOTPForm />
      </div>
      <div />
    </div>
  );
}
