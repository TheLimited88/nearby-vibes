'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroHeader}>
          <div className={styles.logo}>NV Nearby Vibes</div>
          <button className={styles.menuBtn}>☰</button>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.imagePlaceholder}>
            🖼️ Hero — venue crowd / nightlife
          </div>
        </div>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Live Specials</h1>
          <p className={styles.heroSubtitle}>Near You</p>
        </div>
      </section>

      {/* Venue Modal */}
      <div className={styles.modalOverlay}>
        <div className={styles.venueModal}>
            <div className={styles.modalIcon}>🛡️</div>
            <h2 className={styles.modalTitle}>Own a Venue?</h2>
            <p className={styles.modalText}>
              Get your venue live in minutes and reach more locals today.
            </p>
            <Button
              onClick={() => router.push('/auth/signup?role=venue')}
              className={styles.modalButton}
            >
              Get Started →
            </Button>
            <div className={styles.modalFeatures}>
              <span>✓ 100% Free</span>
              <span>✓ Post in seconds</span>
              <span>✓ No commitment</span>
            </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <section className={styles.navTabs}>
        <div className={styles.tab}>
          <div className={styles.tabIcon}>⚡</div>
          <span>Live specials</span>
        </div>
        <div className={styles.tab}>
          <div className={styles.tabIcon}>📍</div>
          <span>Nearby venues</span>
        </div>
        <div className={styles.tab}>
          <div className={styles.tabIcon}>🔔</div>
          <span>Smart notify</span>
        </div>
      </section>

      {/* Active Offers Section */}
      <section className={styles.offersSection}>
        <div className={styles.offersHeader}>
          <div>
            <h2 className={styles.offersTitle}>ACTIVE OFFERS NEAR YOU</h2>
            <span className={styles.distanceLabel}>&lt;0.75mi</span>
          </div>
          <span className={styles.liveCount}>6 live</span>
        </div>

        <div className={styles.grid}>
          {/* Sample Card 1 */}
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <div className={styles.imagePlaceholder}>Venue photo</div>
              <div className={styles.timer}>
                <span>● LIVE</span>
                <span>2:30</span>
              </div>
              <div className={styles.discountBadge}>DRINK</div>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.distance}>0.3 mi</p>
              <h3>Aye Aye</h3>
              <p className={styles.address}>2 for 1 Margaritas</p>
              <p className={styles.venue}>118 5th Ave</p>
              <div className={styles.cardActions}>
                <button className={styles.actionBtn}>⊞</button>
                <button className={styles.actionBtn}>📍</button>
              </div>
            </div>
          </div>

          {/* Sample Card 2 */}
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <div className={styles.imagePlaceholder}>Venue photo</div>
              <div className={styles.timer}>
                <span>● LIVE</span>
                <span>1:45</span>
              </div>
              <div className={`${styles.discountBadge} ${styles.food}`}>
                FOOD
              </div>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.distance}>0.6 mi</p>
              <h3>241 Bar</h3>
              <p className={styles.address}>Wings Special</p>
              <p className={styles.venue}>77 Harbor</p>
              <div className={styles.cardActions}>
                <button className={styles.actionBtn}>⊞</button>
                <button className={styles.actionBtn}>📍</button>
              </div>
            </div>
          </div>

          {/* Sample Card 3 */}
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <div className={styles.imagePlaceholder}>Venue photo</div>
              <div className={styles.timer}>
                <span>● LIVE</span>
                <span>0:15</span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.distance}>Nearby</p>
              <h3>The Hub</h3>
              <p className={styles.address}>Happy Hour</p>
              <p className={styles.venue}>Downtown</p>
              <div className={styles.cardActions}>
                <button className={styles.actionBtn}>⊞</button>
                <button className={styles.actionBtn}>📍</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign In CTA */}
      <section className={styles.signInSection}>
        <h2>Sign in to see all specials near you</h2>
        <Button
          onClick={() => router.push('/auth/signin')}
          fullWidth
          className={styles.signInBtn}
        >
          Sign In
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push('/auth/signup')}
          fullWidth
          className={styles.signUpBtn}
        >
          Create Account
        </Button>
      </section>
    </div>
  );
}
