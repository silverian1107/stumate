'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import FormField from '@/components/FormField';
import TextInput from '@/components/formInput/TextInput';
import { Button } from '@/components/ui/button';
import { openSnackbar } from '@/redux/slices/snackbarSlice';
import {
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyCodePasswordMutation
} from '@/service/rootApi';

interface ForgotPasswordForm {
  email: string;
  codeId?: string;
  newPassword?: string;
}

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const { control, handleSubmit } = useForm<ForgotPasswordForm>();
  const router = useRouter();
  const dispatch = useDispatch();

  // Mutation API
  const [requestPasswordReset, { isLoading: isRequestLoading }] =
    useForgotPasswordMutation();
  const [verifyPasswordResetCode, { isLoading: isVerifyLoading }] =
    useVerifyCodePasswordMutation();
  const [changePassword, { isLoading: isChangeLoading }] =
    useChangePasswordMutation();

  const handleSendCode: SubmitHandler<ForgotPasswordForm> = async ({
    email
  }) => {
    try {
      await requestPasswordReset({ email }).unwrap();
      dispatch(
        openSnackbar({
          message: `Code has been sent to ${email}. Check your inbox.`,
          severity: 'success'
        })
      );
      setStep(2);
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error: any) {
      setMessage('Email field can not blank');
    }
  };

  const handleVerifyAndChangePassword: SubmitHandler<
    ForgotPasswordForm
  > = async ({ email, codeId, newPassword }) => {
    try {
      await verifyPasswordResetCode({ email, codeId: codeId! }).unwrap();
      await changePassword({
        email,
        password: newPassword!
      }).unwrap();

      dispatch(
        openSnackbar({
          message:
            'Password has been successfully changed. Redirecting to login.',
          severity: 'success'
        })
      );

      router.push('/login');
    } catch (error: any) {
      setMessage(error.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <p className="text-2xl font-semibold text-center text-gray-800">
          Forgot Password
        </p>
        {message && (
          <p
            className={`mt-4 text-sm text-center ${message.includes('not exist') ? 'text-red-500' : 'text-blue-500'}`}
          >
            {message}
          </p>
        )}

        <form
          className="mt-6 space-y-6"
          onSubmit={handleSubmit(
            step === 1 ? handleSendCode : handleVerifyAndChangePassword
          )}
        >
          {step === 1 ? (
            <FormField
              control={control}
              name="email"
              label="Email"
              placeHolder="Enter your email"
              Component={TextInput}
              type="email"
            />
          ) : (
            <>
              <FormField
                control={control}
                name="codeId"
                label="Verification Code"
                placeHolder="Enter the code sent to your email"
                Component={TextInput}
              />
              <FormField
                control={control}
                name="newPassword"
                label="New Password"
                placeHolder="Enter your new password"
                Component={TextInput}
                type="password"
              />
            </>
          )}
          <Button
            type="submit"
            disabled={isRequestLoading || isVerifyLoading || isChangeLoading}
            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none ${
              isRequestLoading || isVerifyLoading || isChangeLoading
            }`}
          >
            {isRequestLoading
              ? 'Sending...'
              : isVerifyLoading || isChangeLoading
                ? 'Processing...'
                : step === 1
                  ? 'Send Code'
                  : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
