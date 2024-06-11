
'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Register.module.css"; // Import CSS module

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const router = useRouter();


  const handleRegister = async () => {
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })

      });
      const data = await response.json()
      if (response.ok) {
        // Redirect to login page
        router.push('/login');
      } else {
        // Display error message if registration failed
        alert(data.message);
      }
        setEmail("")
        setPassword("")
        setConfirmPassword("")
    }
    catch (error) {
      console.error('Error:', error)
    }

  }
  return (
    <div className={styles["register-page"]}>
      <div className={styles["register-container"]}>
        <div className={styles.register}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQioG1tzPntbiUgNy8VitgxrJt18g5OqA1L3vJVQwbNCrK4IJTbkWz-ZIplPpcNOnF4oGg&usqp=CAU" className={styles.logo} alt='logo' />

          <h1>REGISTER</h1>
          <h2>Make a new account easily</h2>

          <div className={styles["input-container"]}>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <input type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
          </div>

          <div className={styles["button-container"]}>
            <button onClick={handleRegister}>Register</button>
          </div>
          <h3>Already a m<sup>ember</sup>? <Link href="/login" className={styles["login-link"]}>Login</Link></h3>

          
        </div>
        <div className={styles["register-image"]}>
          <img src="https://images.unsplash.com/photo-1559526324-593bc073d938?w=960&h=1280&fit=crop" alt="register" />
        </div>
      </div>
    </div>
  );
}

export default Register;

