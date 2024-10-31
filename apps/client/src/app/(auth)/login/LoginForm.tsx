'use client';
import FormField from '@/components/FormField';

import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@mui/material';
import TextInput from '@/components/formInput/TextInput';
import { loginSchema, LoginValues } from '@/app/libs/Validation';
import { useForm } from 'react-hook-form';

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  function onSubmit(formData: LoginValues) {
    console.log({ formData });
  }
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <FormField<LoginValues >
        name="email"
        placeHolder="Email"
        control={control}
        Component={TextInput}
        error={errors['email']}
      />
      <FormField<LoginValues>
        name="password"
        placeHolder="Password"
        control={control}
        Component={TextInput}
        type="password"
        error={errors['password']}
      />
      <Button variant="contained" type="submit" sx={{ height: '36px' }}>
        Log In
      </Button>
    </form>
  );
}