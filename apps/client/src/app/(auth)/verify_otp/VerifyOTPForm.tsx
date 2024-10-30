'use client';
import FormField from '@/components/FormField';

import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@mui/material';

import { verifyOtpSchema, VerifyOtpValues } from '@/app/libs/Validation';
import { useForm } from 'react-hook-form';
import OTPInput from '@/components/formInput/OTPInput';

export default function VerifyOTPForm() {
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
  function onSubmit(formData: VerifyOtpValues) {
    console.log({ formData });
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
    </form>
  );
}
