/* eslint-disable @typescript-eslint/no-explicit-any */
// FormField.tsx
import { FormHelperText } from '@mui/material';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';

interface FormFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  placeHolder?: string;
  name: Path<T>; // Ensure `name` matches fields in `T`
  Component: React.ComponentType<any>;
  type?: string;
  error?: FieldError;
}

export default function FormField<T extends FieldValues>({
  control,
  placeHolder,
  name,
  Component,
  type,
  error,
}: FormFieldProps<T>) {
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <Component
            placeHolder={placeHolder}
            onChange={onChange}
            value={value}
            name={name}
            type={type}
            error={!!error}
          />
        )}
      />
      {/* Display error message below the input */}
      {error?.message && <FormHelperText error>{error.message}</FormHelperText>}
    </div>
  );
}
