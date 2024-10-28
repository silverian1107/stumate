import FormField from '@/components/FormField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import TextInput from '@/components/formInput/TextInput';
const formSchema = yup.object().shape({
  fullName: yup.string().required(),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email is not valid',
    )
    .required(),
  password: yup.string().required(),
});
type FormValues = yup.InferType<typeof formSchema>

export default function RegisterForm() {
    const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm<FormValues>({
        resolver: yupResolver(formSchema),
        defaultValues: {
          fullName: '',
          email: '',
          password: '',
        },
      });
  function onSubmit(formData: FormValues) {
    console.log({ formData });
  }
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        name="fullName"
        label="Full Name"
        control={control}
        Component={TextInput}
        error={errors['fullName']}
      />
      <FormField
        name="email"
        label="Email"
        control={control}
        Component={TextInput}
        error={errors['email']}
      />
      <FormField
        name="password"
        label="Password"
        control={control}
        Component={TextInput}
        type="password"
        error={errors['password']}
      />
      <Button variant="contained" type="submit">
        Sign up
      </Button>
    </form>
  );
}
