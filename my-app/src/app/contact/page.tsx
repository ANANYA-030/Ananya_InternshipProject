"use client"; // Ensure the file is a client component

import React, { useState } from 'react';
import styles from './Contact.module.css'; // Importing the CSS module
import Link from 'next/link';

const Contact = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/contact', {  // Adjust the URL if necessary
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, message }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");

    } else {
      setResponseMessage("An error occurred while sending your message.");
    }
  };

  return (
    <div className={styles['page-container']}>
      <div className={styles['top-container']}>
        <h1>Feel free to Contact</h1>
        <p>Enter the following details to reach us</p>
        <div>
          <div className={styles['form-row']}>
            <div className={styles['form-label']}>
              <label htmlFor="firstName">First Name:</label>
              <label htmlFor="lastName">Last Name:</label>
              <label htmlFor="email">Your Email:</label>
            </div>
            <div className={styles['form-input']}>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className={styles['form-row']}>
            <div className={styles['form-label']}>
              <label htmlFor="message">Message:</label>
            </div>
            <div className={styles['form-input']}>
              <textarea
                className={styles['textarea-field']}
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
          </div>
          <button type="button" className={styles['send-button']} onClick={handleSubmit}>
            Send Message
          </button>
        </div>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
      <div className={styles['bottom-container']}>
        <div className={styles['bottom-left-container']}>
          <div className={styles['logo']}>
            <img
              src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/qb9v0oxs3sekdbhat1is"
              style={{ width: '80px', height: 'auto' }}
              alt="logo"
            />
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <div className={styles['social-icons']}>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
          </div>
        </div>
        <div className={styles['quick-links']}>
          <div className={styles['quick-link']}>
            <h2>Quick Links</h2>
            <a href="#">How it Works</a>
            <a href="#">Why Choose Us</a>
          </div>
          <div className={styles['quick-link']}>
            <h2>About</h2>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
          <div className={styles['quick-link']}>
            <h2>Contact</h2>
            <Link href="/contact">Contact Us</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
