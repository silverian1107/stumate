'use client';
import FormField from '@/components/FormField';

import { yupResolver } from '@hookform/resolvers/yup';

import { Button, FormHelperText } from '@mui/material';
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
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      agreeToTerms: false,
    },
  });
  function onSubmit(formData: RegisterValues) {
    console.log({ formData });
  }
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <FormField<RegisterValues>
        name="username"
        placeHolder="Username"
        control={control}
        Component={TextInput}
        error={errors['username']}
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
      <div className="relative flex items-center gap-1 mb-2">
        <FormField<RegisterValues>
          name="agreeToTerms" // Change to a different name for clarity
          control={control}
          Component={CheckBoxInput}
          type="checkbox"
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
        {errors['agreeToTerms'] && (
          <FormHelperText
            sx={{
              fontSize: '12px',
            }}
            className="absolute -bottom-3 w-full px-2"
            error
          >
            {errors['agreeToTerms'].message}
          </FormHelperText>
        )}
      </div>
      <Button
        variant="contained"
        type="submit"
        sx={{ height: '36px', marginTop: '-1rem' }}
      >
        Sign up
      </Button>
    </form>
  );
}
