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
  label?: string;
}

export default function FormField<T extends FieldValues>({
  control,
  placeHolder,
  name,
  Component,
  type,
  error,
  label,
}: FormFieldProps<T>) {
  return (
    <div className="relative">
      {label && (
        <p className="font-bold mb-3 text-sm text-primary-main">{label}</p>
      )}
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
      {error?.message && (
        <FormHelperText
          sx={{
            fontSize: '12px',
          }}
          className="px-2 absolute -bottom-5 w-full"
          error
        >
          {error.message}
        </FormHelperText>
      )}
    </div>
  );
}
