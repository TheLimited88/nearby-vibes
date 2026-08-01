'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './become-venue.module.css';

export default function BecomeVenuePage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Get your venue live in minutes</h1>
          <p className={styles.subtitle}>Reach more locals. Post time-limited specials. Track what works.</p>
        </section>

        <section className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Post in Seconds</h3>
            <p>Create and publish drink or food specials instantly</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Real-Time Analytics</h3>
            <p>See how many customers engaged with your posts</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>Target Local Customers</h3>
            <p>Reach customers within walking distance of your venue</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>💰</div>
            <h3>100% Free</h3>
            <p>No signup fees, no monthly costs, no commitments</p>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaBox}>
            <h2>Ready to get started?</h2>
            <p>Set up your venue account and post your first special today</p>
            <button
              className={styles.ctaBtn}
              onClick={() => router.push('/auth/signup?role=venue')}
            >
              Create Venue Account
            </button>
            <p className={styles.note}>
              Already have an account? <a href="/auth/signin?role=venue">Sign in</a>
            </p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
      </footer>
    </div>
  );
}
