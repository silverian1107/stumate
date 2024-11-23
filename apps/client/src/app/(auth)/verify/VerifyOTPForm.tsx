'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { redirect, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { VerifyOtpValues } from '@/app/libs/Validation';
import { verifyOtpSchema } from '@/app/libs/Validation';
import FormField from '@/components/FormField';
import OTPInput from '@/components/formInput/OTPInput';
import { useResendOTPMutation, useVerifyOTPMutation } from '@/service/rootApi';

export default function VerifyOTPForm() {
  const searchParam = useSearchParams();
  const email = searchParam.get('email');
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<VerifyOtpValues>({
    resolver: yupResolver(verifyOtpSchema),
    defaultValues: {
      codeId: ''
    }
  });
  const [verifyOTP, { isSuccess: isVerifySuccess }] = useVerifyOTPMutation();
  const [resendOTP, { isSuccess: isResendSuccess }] = useResendOTPMutation();
  function onSubmit(formData: VerifyOtpValues) {
    verifyOTP({ email: email as string, codeId: formData?.codeId });
  }
  useEffect(() => {
    if (isVerifySuccess || isResendSuccess) {
      redirect('/login');
    }
  }, [isResendSuccess, isVerifySuccess]);
  const handleResend = () => {
    resendOTP({ email: email as string });
  };
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <FormField<VerifyOtpValues>
        name="codeId"
        label="Type your 6 digit security code"
        control={control}
        Component={OTPInput}
        error={errors.codeId}
      />
      <Button variant="contained" type="submit" sx={{ height: '36px' }}>
        Verify my account
      </Button>
      <div className="flex  items-center justify-center  text-sm">
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
