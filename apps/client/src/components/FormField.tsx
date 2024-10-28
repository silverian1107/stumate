/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormHelperText } from '@mui/material';
import { Control, Controller, FieldError, FieldValues } from 'react-hook-form';

interface FormFieldProps {
  control: Control<FieldValues>;
  label: string;
  name: string;
  Component: React.ComponentType<any>;
  type?: string;
  error?: FieldError;
}

export default function FormField({
  control,
  label,
  name,
  Component,
  type,
  error,
}: FormFieldProps) {
  return (
    <div>
      <p className="font-bold mb-1 text-sm text-dark-100">{label}</p>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <Component
            onChange={onChange}
            value={value}
            name={name}
            type={type}
            error={!!error}
          />
        )}
      />
      {/* Display error message below the input */}
      {error?.message && (
        <FormHelperText error>{error.message}</FormHelperText>
      )}
    </div>
  );
}
