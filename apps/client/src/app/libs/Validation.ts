import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email is not valid',
    )
    .required(),
  password: yup.string().required(),
  confirm_password: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match'),
  agreeToTerms: yup.boolean().oneOf([true], ' You must agree with term'),
});
export type RegisterValues = yup.InferType<typeof registerSchema>;


export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email is not valid',
    )
    .required(),
  password: yup.string().required(),
});
export type LoginValues = yup.InferType<typeof loginSchema>;

export const verifyOtpSchema = yup.object().shape({
  otp: yup.string().required(),
});
export type VerifyOtpValues = yup.InferType<typeof verifyOtpSchema>;
