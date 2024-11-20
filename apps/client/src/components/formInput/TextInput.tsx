import { ChangeEventHandler } from 'react';

import { TextField } from '@mui/material';

interface TextInputProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  name: string;
  type?: string;
  error?: boolean;
  placeHolder: string;
}
const TextInput = ({
  onChange,
  value,
  name,
  type = 'text',
  error,
  placeHolder,
}: TextInputProps) => {
  return (
    // slotProps de them funtion cho tuy chinh doc tren document cua mui
    <TextField
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'var(--primary-700)',
          fontFamily: 'Arial',
          fontWeight: 'bold',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary-300)',
            borderWidth: '2px',
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-700)',
              borderWidth: '2px',
            },
          },
        },
        '& .MuiInputLabel-root': {
          color: 'var(--primary-300)',
          fontWeight: 'bold',
          '&.Mui-focused': {
            color: 'var(--primary-700)',
            fontWeight: 'bold',
          },
        },
      }}
      label={name}
      name={name}
      onChange={onChange}
      value={value}
      type={type}
      // neu loi la bao do
      error={error}
      placeholder={placeHolder}
    />
  );
};

export default TextInput;
