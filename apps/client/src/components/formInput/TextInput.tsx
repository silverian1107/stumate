import { TextField } from '@mui/material';

import { ChangeEventHandler } from 'react';

interface TextInputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
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
      slotProps={{
        input: { className: 'h-8 py-2 px-3 !text-[15px] !border !border-primary-main !text-primary-main' },
        htmlInput: { className: '!p-0' },
        
      }}
      
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



