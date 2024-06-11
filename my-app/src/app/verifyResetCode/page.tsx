"use client"; // Ensure the file is a client component

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import styles from "./OtpInput.module.css";
import OtpInput from './OtpInput';


const VerifyResetCode: React.FC = () => {
    const [resetCode, setResetCode] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const handleOtpChange = (otp: string) => {
        setResetCode(otp);
      }

    const handleSubmit = async () => {
        const res = await fetch('/api/verify-reset-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, resetCode }),
        });

        const data = await res.json();
        if (res.ok) {
            router.push(`/resetPassword?email=${encodeURIComponent(email)}&resetCode=${encodeURIComponent(resetCode)}`);
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div className={styles["login-page"]}>
      <div className={styles["login-container"]}>
        <div className={styles.login}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQioG1tzPntbiUgNy8VitgxrJt18g5OqA1L3vJVQwbNCrK4IJTbkWz-ZIplPpcNOnF4oGg&usqp=CAU" className={styles.logo} alt='logo' />

          <h1>VERIFY EMAIL</h1>
          <h2>Enter the 5 digit code received in your phone number.</h2>
          <br></br>

          <div>
          <h1>Enter your OTP</h1>
          <br></br>
          <OtpInput length={5} onChange={handleOtpChange} />
          </div>
          <br></br>


          <h3>Not recieved? <Link href="/requestResetPassword" className={styles["register-link"]}>Resend</Link></h3>
          <div className={styles["button-container"]}>
            <button onClick={handleSubmit}>Verify</button>
          </div>
          

        </div>
        <div className={styles["login-image"]}>
          <img src="https://img.freepik.com/premium-vector/choose-option-right-wrong_1076263-1313.jpg?w=2000" alt="login" />
        </div>
      </div>

    </div>

    );
};

export default VerifyResetCode;
