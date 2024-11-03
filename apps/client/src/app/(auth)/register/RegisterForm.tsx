'use client';

import { registerSchema, RegisterValues } from '@/app/libs/Validation';
import FormField from '@/components/FormField';
import CheckBoxInput from '@/components/formInput/CheckBoxInput';
import TextInput from '@/components/formInput/TextInput';
import { useRegisterMutation } from '@/service/rootApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '@/redux/slices/snackbarSlice';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      agreeToTerms: false,
    },
  });

  const [register, { isSuccess }] = useRegisterMutation();
  function onSubmit(formData: RegisterValues) {
    console.log({ formData });
    register(formData);
  }

  useEffect(() => {
    if (isSuccess) {
      const email = getValues('email');
      router.push(`/verify?email=${encodeURIComponent(email)}`);
      dispatch(openSnackbar({message: 'Register successfully!'}))
    }
  }, [router, isSuccess, getValues, dispatch]);
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
        <label
          htmlFor="agreeToTerms"
          className="flex gap-1 text-[12px] text-secondary-main font-bold items-end"
        >
          I agree to the{' '}
          <Link
            href=""
            className="text-primary-main font-normal underline underline-offset-4"
          >
            term & policy
          </Link>
        </label>
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
