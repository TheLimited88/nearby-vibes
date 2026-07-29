'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { useAuthStore } from '@/stores/authStore';
import { authAPI } from '@/lib/apiClient';
import styles from '../auth.module.css';

export default function SignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const role = (params.get('role') as 'customer' | 'venue') || 'customer';
  const { setUser, setToken, setError, error, isLoading, setLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await authAPI.loginEmail(email, password, role) as any;
      const { user, token } = response.data;

      setUser(user);
      setToken(token);

      // Redirect based on role
      if (user.role === 'venue') {
        router.push('/venue/dashboard');
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Sign in failed';
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
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.subtitle}>
            {role === 'venue' ? 'Manage your venue' : 'Discover nearby specials'}
          </p>
        </div>

        <form onSubmit={handleSignIn} className={styles.form}>
          {(localError || error) && (
            <div className={styles.error}>
              {localError || error}
            </div>
          )}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className={styles.divider}>or</div>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => router.push(`/auth/signup?role=${role}`)}
        >
          Create New Account
        </Button>

        {role === 'customer' && (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => router.push('/auth/signin?role=venue')}
          >
            Sign in as venue owner
          </Button>
        )}

        {role === 'venue' && (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => router.push('/auth/signin?role=customer')}
          >
            Back to customer sign in
          </Button>
        )}
      </Card>
    </div>
  );
}
