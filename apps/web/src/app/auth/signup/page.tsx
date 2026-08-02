'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { useAuthStore } from '@/stores/authStore';
import { authAPI } from '@/lib/apiClient';
import styles from '../auth.module.css';

interface PasswordRequirements {
  minLength: boolean;
  hasCapital: boolean;
  hasSymbol: boolean;
}

export default function SignUp() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<'customer' | 'venue'>((params.get('role') as 'customer' | 'venue') || 'customer');
  const { setUser, setToken, setError, error, isLoading, setLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const passwordRequirements: PasswordRequirements = useMemo(() => ({
    minLength: password.length >= 8,
    hasCapital: /[A-Z]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }), [password]);

  const isBusinessEmail = (emailStr: string): boolean => {
    const freeEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'mail.com', 'protonmail.com'];
    const domain = emailStr.split('@')[1]?.toLowerCase();
    return domain ? !freeEmailDomains.includes(domain) : false;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (role === 'venue' && !isBusinessEmail(email)) {
      setLocalError('Venue accounts require a business email address');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await authAPI.signUp(email, password, role) as any;
      const { user, token } = response.data;

      setUser(user);
      setToken(token);

      if (user.role === 'venue') {
        router.push('/venue/onboarding');
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Sign up failed';
      setLocalError(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logoIcon} />
          <span className={styles.logoText}>Nearby Vibes</span>
        </div>

        {/* Role Toggle */}
        <div className={styles.roleToggle}>
          <button
            className={`${styles.roleButton} ${role === 'customer' ? styles.active : ''}`}
            onClick={() => setRole('customer')}
          >
            I want deals
          </button>
          <button
            className={`${styles.roleButton} ${role === 'venue' ? styles.active : ''}`}
            onClick={() => setRole('venue')}
          >
            I run a venue
          </button>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            {role === 'venue' ? 'Get your specials in front of customers' : 'Live specials, right where you are'}
          </h1>
          {role === 'venue' && (
            <div className={styles.venueTagline}>
              ✓ Start posting in minutes. No credit card. No lock-in.
            </div>
          )}
        </div>

        <form onSubmit={handleSignUp} className={styles.form}>
          {(localError || error) && (
            <div className={styles.error}>
              {localError || error}
            </div>
          )}

          {role === 'venue' ? (
            // Venue signup flow
            <>
              <button
                type="button"
                className={styles.socialButton}
                onClick={() => setLocalError('Google sign-in coming soon')}
              >
                <svg width="16" height="16" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.6 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.33A9 9 0 009 18z"/>
                  <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 010-3.44V4.95H.95a9 9 0 000 8.1l3.02-2.33z"/>
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.9 11.42 0 9 0A9 9 0 00.95 4.95l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Sign up with business email
              </Button>
            </>
          ) : (
            // Customer signup flow
            <>
              <div className={styles.socialButtons}>
                <button
                  type="button"
                  className={styles.socialButton}
                  onClick={() => setLocalError('Apple sign-in coming soon')}
                >
                  <svg width="14" height="17" viewBox="0 0 14 17" fill="#0A0A0A"><path d="M11.4 2.2c.7-.85 1.2-2 1-2.2-1 .05-2.1.7-2.8 1.5-.6.7-1.15 1.85-1 2.9 1.1.1 2.1-.55 2.8-1.4-.05 0 0 0 0 0zM13.9 12.5c-.35.8-.75 1.6-1.3 2.35-.75 1.05-1.5 2.1-2.7 2.12-1.15.02-1.55-.68-2.85-.68-1.3 0-1.75.66-2.85.7-1.15.05-2-1.13-2.75-2.17C0 12.7-.6 9 .55 6.7c.6-1.15 1.65-1.9 2.8-1.9 1.15-.02 2.05.75 2.85.75.75 0 1.9-.9 3.2-.77.55.02 2.1.22 3.1 1.7-.08.05-1.85 1.1-1.83 3.2.02 2.5 2.2 3.35 2.23 3.35z"/></svg>
                  Continue with Apple
                </button>
                <button
                  type="button"
                  className={styles.socialButton}
                  onClick={() => setLocalError('Google sign-in coming soon')}
                >
                  <svg width="16" height="16" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.6 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.33A9 9 0 009 18z"/>
                    <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 010-3.44V4.95H.95a9 9 0 000 8.1l3.02-2.33z"/>
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.9 11.42 0 9 0A9 9 0 00.95 4.95l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => {}}
                className={styles.emailSignupBtn}
              >
                Sign up with email
              </Button>

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {password && (
                <div className={styles.requirements}>
                  <div className={`${styles.requirement} ${passwordRequirements.minLength ? styles.met : ''}`}>
                    <span className={styles.checkbox}>
                      {passwordRequirements.minLength ? '✓' : '○'}
                    </span>
                    <span>8+ characters</span>
                  </div>
                  <div className={`${styles.requirement} ${passwordRequirements.hasCapital ? styles.met : ''}`}>
                    <span className={styles.checkbox}>
                      {passwordRequirements.hasCapital ? '✓' : '○'}
                    </span>
                    <span>1 capital letter</span>
                  </div>
                  <div className={`${styles.requirement} ${passwordRequirements.hasSymbol ? styles.met : ''}`}>
                    <span className={styles.checkbox}>
                      {passwordRequirements.hasSymbol ? '✓' : '○'}
                    </span>
                    <span>1 symbol</span>
                  </div>
                </div>
              )}

              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </>
          )}
        </form>

        <div className={styles.divider}>or</div>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => router.push(`/auth/signin?role=${role}`)}
        >
          Already have an account?
        </Button>

        <div className={styles.footer}>
          By continuing you agree to our <a href="#tos">Terms</a> &amp; <a href="#privacy">Privacy Policy</a>
        </div>
      </Card>
    </div>
  );
}
