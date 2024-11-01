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
import { redirect } from 'next/navigation';


export default function LoginForm() {
  const dispatch = useDispatch();
  const [login , { data , isSuccess }] = useLoginMutation();
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
    login(formData);
  }
  useEffect(() => {
    if(isSuccess ){
      if(data.userInfo.isActive === true){
        dispatch(loginState({
          accessToken: data.token,
          refreshToken: data.token,
          userInfo: data.userInfo,
        }
        ))
        redirect('/');
      }
    }
  }, [data, isSuccess, dispatch])
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <FormField<LoginValues>
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
