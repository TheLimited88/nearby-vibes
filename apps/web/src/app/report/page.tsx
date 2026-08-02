'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './report.module.css';

export default function ReportContentPage() {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    'Inappropriate content',
    'Scam or fraud',
    'Offensive language',
    'False information',
    'Spam',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit report to API
    setSubmitted(true);
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2>Thank you for reporting</h2>
          <p>We'll review your report and take appropriate action</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <h1 className={styles.title}>Report Content</h1>
        <p className={styles.subtitle}>Help us keep Nearby Vibes safe for everyone</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>What's wrong?</label>
            <div className={styles.reasonGrid}>
              {reasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`${styles.reasonBtn} ${reason === r ? styles.selected : ''}`}
                  onClick={() => setReason(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="details">
              Tell us more (optional)
            </label>
            <textarea
              id="details"
              className={styles.textarea}
              placeholder="Provide additional details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!reason}
          >
            Submit Report
          </button>
        </form>
      </main>
    </div>
  );
}
