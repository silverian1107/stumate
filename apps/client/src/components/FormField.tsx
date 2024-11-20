/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormHelperText } from '@mui/material';
import type { Control, FieldError, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

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
  label
}: FormFieldProps<T>) {
  return (
    <div className="relative">
      {label && (
        <p className="text-primary-main mb-3 text-sm font-bold">{label}</p>
      )}
      <Controller
        name={name}
        control={control}
        // eslint-disable-next-line @typescript-eslint/no-shadow
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
            fontSize: '12px'
          }}
          className="absolute -bottom-5 w-full px-2"
          error
        >
          {error.message}
        </FormHelperText>
      )}
    </div>
  );
}
