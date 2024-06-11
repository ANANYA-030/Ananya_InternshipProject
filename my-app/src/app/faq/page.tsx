'use client'
import React, { useState } from 'react';
import styles from './Faq.module.css';



interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is Lorem Ipsum?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    {
      question: "Why do we use it?",
      answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      question: "Where does it come from?",
      answer: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.",
    },
  ];

  const handleToggle = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <div className={styles['faq-background']}>
      <div className={styles['faq-outer-container']}>
        <div className={styles['faq-container']}>
          <div className={styles['faq-title']}>
            <h1>FAQs</h1>
          </div>
          <div className={styles['faq-body']}>
            {faqs.map((faq, index: number) => (
              <div key={index} className={styles['faq-box']}>
                <div
                  className={styles['faq-question']}
                  onClick={() => handleToggle(index)}
                >
                  <span>{faq.question}</span>
                  {expandedIndex === index ? ' v' : ' >'}
                </div>
                {expandedIndex === index && (
                  <div className={styles['faq-answer']}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
