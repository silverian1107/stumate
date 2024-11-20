import { ChangeEventHandler } from 'react';

import { Checkbox } from '@mui/material';

interface CheckBoxInputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  checked: boolean; // Use checked instead of value
  name: string;
  error?: boolean;
}
const CheckBoxInput = ({ onChange, name, checked }: CheckBoxInputProps) => {
  return (
    // slotProps de them funtion cho tuy chinh doc tren document cua mui
    <Checkbox
      sx={{
        '& .MuiSvgIcon-root': { fontSize: 15 },
        padding: 0,
        paddingBottom: '4px',
      }}
      name={name}
      onChange={onChange}
      checked={checked}

      // neu loi la bao do
    />
  );
};

export default CheckBoxInput;
