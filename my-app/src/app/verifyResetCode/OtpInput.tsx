// /OtpInput.tsx
import { useState, ChangeEvent, FocusEvent } from 'react';
import styles from './OtpInput.module.css';

interface OtpInputProps {
  length?: number;
  onChange: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 5, onChange }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    if (isNaN(Number(e.target.value))) return;

    const newOtp = [...otp];
    newOtp[index] = e.target.value;

    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Focus on the next input
    if (e.target.nextSibling && e.target.value) {
      (e.target.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={styles.otpContainer}>
      {otp.map((value, index) => (
        <input
          className={styles.otpInput}
          type="text"
          maxLength={1}
          key={index}
          value={value}
          onChange={(e) => handleChange(e, index)}
          onFocus={handleFocus}
        />
      ))}
    </div>
  );
};

export default OtpInput;
