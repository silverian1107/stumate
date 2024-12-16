/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Cookies from 'js-cookie';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import type { LoginValues } from '@/app/libs/Validation';
import { loginSchema } from '@/app/libs/Validation';
import FormField from '@/components/FormField';
import TextInput from '@/components/formInput/TextInput';
import { login as loginState } from '@/redux/slices/authSlice';
import { openSnackbar } from '@/redux/slices/snackbarSlice';
import { useLoginMutation } from '@/service/rootApi';

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { data, isSuccess, isError, error }] = useLoginMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  function onSubmit(formData: LoginValues) {
    login(formData);
  }

  useEffect(() => {
    if (isError) {
      if ('data' in error) {
        dispatch(
          openSnackbar({
            type: 'error',
            message: (error.data as { message: string }).message
          })
        );
      } else {
        dispatch(openSnackbar({ type: 'error', message: 'An error occurred' }));
      }
    }
    if (isSuccess) {
      if (data.statusCode === 201) {
        dispatch(
          loginState({
            accessToken: data.data.access_token
          })
        );
        dispatch(openSnackbar({ message: data?.message }));
        Cookies.set('access_token', data.data.access_token, {
          expires: 30 * 1000 * 60
        });
        redirect('/apps');
      } else {
        const email = getValues('username');
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      }
    }
  }, [data, isSuccess, dispatch, getValues, router, isError, error]);
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <FormField<LoginValues>
        name="username"
        placeHolder="Email"
        control={control}
        Component={TextInput}
        error={errors.username}
      />
      <FormField<LoginValues>
        name="password"
        placeHolder="Password"
        control={control}
        Component={TextInput}
        type="password"
        error={errors.password}
      />
      <Button variant="contained" type="submit" sx={{ height: '36px' }}>
        Log In
      </Button>
    </form>
  );
}
