import { MuiOtpInput } from 'mui-one-time-password-input';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
}

const OTPInput = ({ value, onChange }: OTPInputProps) => {
  return <MuiOtpInput value={value} onChange={onChange} length={6} />;
};

export default OTPInput;
