'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/Button';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'venue') {
        router.push('/venue/dashboard');
      } else {
        router.push('/home');
      }
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.content}>
          <h1 className={styles.title}>Nearby Vibes</h1>
          <p className={styles.subtitle}>
            Discover time-limited specials from nearby venues in real-time
          </p>

          <div className={styles.ctas}>
            <Button
              size="lg"
              fullWidth
              onClick={() => router.push('/auth/signin')}
            >
              Sign In
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => router.push('/auth/signup')}
            >
              Create Account
            </Button>
          </div>

          <Button
            variant="ghost"
            size="lg"
            fullWidth
            onClick={() => router.push('/become-venue')}
          >
            Are you a venue owner?
          </Button>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3>🎯 Discover</h3>
          <p>Find specials from venues around you</p>
        </div>
        <div className={styles.feature}>
          <h3>⚡ Real-Time</h3>
          <p>Time-limited offers that change throughout the day</p>
        </div>
        <div className={styles.feature}>
          <h3>✅ Verified</h3>
          <p>Confirm your visit with a QR code and location</p>
        </div>
      </div>
    </div>
  );
}
