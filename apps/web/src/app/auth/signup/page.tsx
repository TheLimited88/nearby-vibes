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
  const role = (params.get('role') as 'customer' | 'venue') || 'customer';
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
      setLocalError('Venue accounts require a business email address (e.g., yourname@yourcompany.com)');
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
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            {role === 'venue' ? 'Manage your venue on Nearby Vibes' : 'Join Nearby Vibes'}
          </p>
        </div>

        <form onSubmit={handleSignUp} className={styles.form}>
          {(localError || error) && (
            <div className={styles.error}>
              {localError || error}
            </div>
          )}

          <Input
            type="email"
            placeholder={role === 'venue' ? 'Business Email (e.g., name@company.com)' : 'Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {role === 'venue' && email && (
            <div className={`${styles.emailValidation} ${isBusinessEmail(email) ? styles.valid : styles.invalid}`}>
              {isBusinessEmail(email) ? '✓ Business email verified' : '✗ Please use a business email address'}
            </div>
          )}

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
                <span>At least 8 characters</span>
              </div>
              <div className={`${styles.requirement} ${passwordRequirements.hasCapital ? styles.met : ''}`}>
                <span className={styles.checkbox}>
                  {passwordRequirements.hasCapital ? '✓' : '○'}
                </span>
                <span>At least one capital letter</span>
              </div>
              <div className={`${styles.requirement} ${passwordRequirements.hasSymbol ? styles.met : ''}`}>
                <span className={styles.checkbox}>
                  {passwordRequirements.hasSymbol ? '✓' : '○'}
                </span>
                <span>At least one symbol (!@#$%^&*)</span>
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
        </form>

        <div className={styles.divider}>or</div>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => router.push(`/auth/signin?role=${role}`)}
        >
          Already have an account?
        </Button>

        {role === 'customer' && (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => router.push('/auth/signup?role=venue')}
          >
            Sign up as venue owner
          </Button>
        )}

        {role === 'venue' && (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => router.push('/auth/signup?role=customer')}
          >
            Back to customer sign up
          </Button>
        )}
      </Card>
    </div>
  );
}
