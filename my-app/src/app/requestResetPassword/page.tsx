'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation"; // Updated import path
import styles from "./forgot.module.css";

const RequestResetPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const router = useRouter();

    const handleForgotPassword = async () => {
        const res = await fetch('/api/request-reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
            router.push(`/verifyResetCode?email=${encodeURIComponent(email)}`);
        } else {
            alert(data.message);
        }
    };

    return (
        <div className={styles["login-page"]}>
          <div className={styles["login-container"]}>
            <div className={styles.login}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQioG1tzPntbiUgNy8VitgxrJt18g5OqA1L3vJVQwbNCrK4IJTbkWz-ZIplPpcNOnF4oGg&usqp=CAU" className={styles.logo} alt='logo' />
    
              <h1>FORGOT PASSWORD</h1><br></br>
              <h2>Enter the email address on which your account is registered.</h2><br></br>
    
              <div className={styles["input-container"]}>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
              </div>
              <br></br>
              <div className={styles["forgot-container"]}>
                <p>Make sure it belongs to you</p>
              </div>  
              <br></br>
              <div className={styles["button-container"]}>
                <button onClick={handleForgotPassword}>Forgot Password</button>
              </div>
            </div>
            <div className={styles["login-image"]}>
              <img src="https://smartbot.digital/home/xit_load_files/images/recovery.webp" alt="login" />
            </div>
          </div>
        </div>
      );
};

export default RequestResetPassword;
