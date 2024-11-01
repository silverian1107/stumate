'use client';

import FormField from '@/components/FormField';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { verifyOtpSchema, VerifyOtpValues } from '@/app/libs/Validation';
import { useForm } from 'react-hook-form';
import OTPInput from '@/components/formInput/OTPInput';
import { useResendOTPMutation, useVerifyOTPMutation } from '@/service/rootApi';
import { useEffect } from 'react';
import { redirect, useSearchParams } from 'next/navigation';

export default function VerifyOTPForm() {
  const searchParam = useSearchParams();
  const email = searchParam.get('email');
  console.log({ email });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpValues>({
    resolver: yupResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  });
  const [verifyOTP, { isSuccess: isVerifySuccess }] = useVerifyOTPMutation();
  const [resendOTP, { isSuccess: isResendSuccess }] = useResendOTPMutation();
  function onSubmit(formData: VerifyOtpValues) {
    console.log({ formData });
    verifyOTP({ email: email as string, otp: formData?.otp });
  }
  useEffect(() => {
    if (isVerifySuccess || isResendSuccess) {
      redirect('/login');
    }
  }, [isResendSuccess, isVerifySuccess]);
  const handleResend = () => {
    resendOTP({email: email as string})
    console.log({email})
  }
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <FormField<VerifyOtpValues>
        name="otp"
        label="Type your 6 digit security code"
        control={control}
        Component={OTPInput}
        error={errors['otp']}
      />
      <Button variant="contained" type="submit" sx={{ height: '36px' }}>
        Verify my account
      </Button>
      <div className="flex  items-center text-sm  justify-center">
        <p className=" font-bold ">Didn&apos;t get the code? </p>
        <Button
          variant="text"
          sx={{ textTransform: 'capitalize', padding: 0, lineHeight: 1 }}
          onClick={handleResend}
        >
          Resend
        </Button>
      </div>
    </form>
  );
}
