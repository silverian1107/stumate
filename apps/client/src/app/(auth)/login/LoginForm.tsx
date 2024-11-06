/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import FormField from '@/components/FormField';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import TextInput from '@/components/formInput/TextInput';
import { loginSchema, LoginValues } from '@/app/libs/Validation';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/service/rootApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login as loginState } from '@/redux/slices/authSlice';
import { redirect, useRouter } from 'next/navigation';
import { openSnackbar } from '@/redux/slices/snackbarSlice';
import Cookies from 'js-cookie';

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { data, isSuccess, isError, error }] = useLoginMutation();
  console.log({ data });
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(formData: LoginValues) {
    console.log({ formData });
    login(formData);
  }

  useEffect(() => {
    console.log({ isSuccess });
    if (isError) {
      if ('data' in error) {
        dispatch(
          openSnackbar({
            type: 'error',
            message: (error.data as { message: string }).message,
          }),
        );
      } else {
        dispatch(openSnackbar({ type: 'error', message: 'An error occurred' }));
      }
    }
    if (isSuccess) {
      console.log(data);
      if (data.statusCode === 201) {
        dispatch(
          loginState({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          }),
        );
        console.log({ data: data.data });
        dispatch(openSnackbar({ message: data?.message }));
        Cookies.set('access_token', data.access_token);
        Cookies.set('refresh_token', data.refresh_token);
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
        error={errors['username']}
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

