"use client"; 

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./Register.module.css";

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const resetCode = searchParams.get('resetCode') || '';

    const handleSubmit = async () => {
        

        const res = await fetch('/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, resetCode, newPassword, confirmPassword }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage('Password reset successfully! Please log in with your new password.');
            setTimeout(() => router.push('/login'), 3000);
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div className={styles["login-page"]}>
      <div className={styles["login-container"]}>
        <div className={styles.login}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQioG1tzPntbiUgNy8VitgxrJt18g5OqA1L3vJVQwbNCrK4IJTbkWz-ZIplPpcNOnF4oGg&usqp=CAU" className={styles.logo} alt='logo' />

          <h1>Email Address Verified Successfully</h1>
          <h2>Set new password</h2>

          <div className={styles["input-container"]}>
            <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Password" />
            <input type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
          </div>

          <div className={styles["button-container"]}>
            <button onClick={handleSubmit}>Verify</button>
          </div>

        </div>
        <div className={styles["login-image"]}>
          <img src="https://codestudio.org/ru/blog/technical_task/img/2969181587548408946703290.png" alt="login" />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
