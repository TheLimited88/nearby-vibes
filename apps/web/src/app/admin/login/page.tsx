'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin-login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [step, setStep] = useState<'email' | 'totp'>('email');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // TODO: API call to verify credentials
      setStep('totp');
    }
  };

  const handleTotpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totp.length === 6) {
      // TODO: API call to verify TOTP
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
        <h1 className={styles.title}>Admin Portal</h1>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className={styles.form}>
            <h2 className={styles.stepTitle}>Sign In</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                placeholder="admin@nearbyvibes.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!email || !password}
            >
              Next
            </button>
          </form>
        )}

        {step === 'totp' && (
          <form onSubmit={handleTotpSubmit} className={styles.form}>
            <h2 className={styles.stepTitle}>Two-Factor Authentication</h2>
            <p className={styles.subtitle}>
              Enter the 6-digit code from your authenticator app
            </p>

            <div className={styles.formGroup}>
              <label className={styles.label}>Authentication Code</label>
              <input
                type="text"
                placeholder="000000"
                value={totp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setTotp(val);
                }}
                maxLength={6}
                className={styles.totpInput}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={totp.length !== 6}
            >
              Verify
            </button>

            <button
              type="button"
              className={styles.backBtn}
              onClick={() => {
                setStep('email');
                setTotp('');
              }}
            >
              Back
            </button>
          </form>
        )}

        <p className={styles.footer}>
          Admin access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
