import { TextField } from "@mui/material";

import { ChangeEventHandler } from "react";

interface TextInputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
  name: string;
  type?: string;
  error?: boolean;
}
const TextInput = ({ onChange, value, name, type = "text", error
} : TextInputProps) => {
 return (
   // slotProps de them funtion cho tuy chinh doc tren document cua mui
   <TextField
   fullWidth
     slotProps={{
       input: { className: "h-10 py-2 px-3" },
       htmlInput: { className: "!p-0" },
     }}
     name={name}
     onChange={onChange}
     value={value}
     type={type}
     // neu loi la bao do
     error={error}
   />
 );
};

export default TextInput;
