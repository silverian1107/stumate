'use client';
import FormField from '@/components/FormField';

import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@mui/material';
import TextInput from '@/components/formInput/TextInput';
import { registerSchema, RegisterValues } from '@/app/libs/Validation';
import { useForm } from 'react-hook-form';
import CheckBoxInput from '@/components/formInput/CheckBoxInput';
import Link from 'next/link';

export default function RegisterForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirm_password: '', // Initialize confirm_password too
      agreeToTerms: false,
    },
  });
  function onSubmit(formData: RegisterValues) {
    console.log({ formData });
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <FormField<RegisterValues>
        name="fullName"
        placeHolder="Username"
        control={control}
        Component={TextInput}
        error={errors['fullName']}
      />
      <FormField<RegisterValues>
        name="email"
        placeHolder="Email"
        control={control}
        Component={TextInput}
        error={errors['email']}
      />
      <FormField<RegisterValues>
        name="password"
        placeHolder="Password"
        control={control}
        Component={TextInput}
        type="password"
        error={errors['password']}
      />
      <FormField<RegisterValues>
        name="confirm_password"
        placeHolder="Re-confirm Password"
        control={control}
        Component={TextInput}
        type="password"
        error={errors['password']}
      />
      <div className="flex items-center gap-1">
        <FormField<RegisterValues>
          name="agreeToTerms" // Change to a different name for clarity
          control={control}
          Component={CheckBoxInput}
          type="checkbox"
          error={errors['agreeToTerms']}
        />
        <p className="flex gap-1 text-[12px] text-secondary-main font-bold items-end">
          I agree to the{' '}
          <Link
            href=""
            className="text-primary-main font-normal underline underline-offset-4"
          >
            term & policy
          </Link>
        </p>
      </div>
      <Button variant="contained" type="submit" sx={{ height: '36px' }}>
        Sign up
      </Button>
    </form>
  );
}
