'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './qr.module.css';

export default function QRLandingPage() {
  const router = useRouter();
  const [trialActivated, setTrialActivated] = useState(false);

  const handleStartTrial = () => {
    // TODO: API call to start 48-hour trial follow
    setTrialActivated(true);
  };

  const venueName = 'Aye Aye Bar';
  const venuAddress = '118 5th Ave';
  const timeRemaining = '47 hours 30 minutes';

  if (trialActivated) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Trial Follow Active</h1>
          <p className={styles.successText}>You're now following {venueName} for 48 hours</p>
          <div className={styles.successDetails}>
            <p>You'll get alerts when they post new specials</p>
            <p className={styles.countdown}>Time remaining: {timeRemaining}</p>
          </div>
          <button
            className={styles.ctaBtn}
            onClick={() => router.push('/home')}
          >
            Back to Specials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <section className={styles.venueSection}>
          <div className={styles.venueImage}></div>
          <h1 className={styles.venueName}>{venueName}</h1>
          <p className={styles.venueAddress}>{venuAddress}</p>
        </section>

        <section className={styles.offerSection}>
          <h2>Special Offer</h2>
          <div className={styles.offerCard}>
            <div className={styles.offerIcon}>🥤</div>
            <p className={styles.offerText}>Get 48-hour alerts for all their specials</p>
          </div>
        </section>

        <section className={styles.benefitsSection}>
          <h2>Why Follow?</h2>
          <div className={styles.benefitsList}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🔔</div>
              <div>
                <h3>Instant Alerts</h3>
                <p>Get notified when they post new deals</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>⏰</div>
              <div>
                <h3>48-Hour Trial</h3>
                <p>No commitment, cancel anytime</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>💰</div>
              <div>
                <h3>Save Money</h3>
                <p>Never miss a great deal nearby</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <button
          className={styles.ctaBtn}
          onClick={handleStartTrial}
        >
          Start 48-Hour Trial
        </button>
        <button
          className={styles.cancelBtn}
          onClick={() => router.back()}
        >
          Maybe Later
        </button>
      </footer>
    </div>
  );
}
