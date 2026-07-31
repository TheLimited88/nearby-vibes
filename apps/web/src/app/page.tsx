'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [showVenueCta, setShowVenueCta] = useState(true);
  const [filter, setFilter] = useState('all');

  return (
    <div className={styles.container}>
      {/* Hero Section - Full Width with Logo Overlay */}
      <div className={styles.heroSection}>
        <div className={styles.heroImage}>
          <div className={styles.imagePlaceholder}>🖼️ Hero — venue crowd / nightlife</div>
        </div>

        {/* Logo + Menu Overlay */}
        <div className={styles.heroHeader}>
          <div className={styles.logoGroup}>
            <div className={styles.logoIcon}>NV</div>
            <div className={styles.logoText}>Nearby Vibes</div>
          </div>
          <button className={styles.menuBtn}>☰</button>
        </div>

        {/* Hero Text Overlay */}
        <div className={styles.heroText}>
          <h1>Live Specials</h1>
          <p>Near You</p>
        </div>
      </div>

      {/* Venue CTA Card */}
      {showVenueCta && (
        <div className={styles.venueCta}>
          <button
            className={styles.dismissBtn}
            onClick={() => setShowVenueCta(false)}
          >
            ✕
          </button>
          <div className={styles.ctaContent}>
            <div className={styles.ctaIcon}>🛡️</div>
            <div className={styles.ctaText}>
              <h3>Own a Venue?</h3>
              <p>Get your venue live in minutes and reach more locals today.</p>
            </div>
          </div>
          <button
            className={styles.ctaButton}
            onClick={() => router.push('/auth/signup?role=venue')}
          >
            Get Started →
          </button>
          <div className={styles.ctaFeatures}>
            <span>✓ 100% Free</span>
            <span>✓ Post in seconds</span>
            <span>✓ No commitment</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'drink' ? styles.active : ''}`}
          onClick={() => setFilter('drink')}
        >
          Drink
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'food' ? styles.active : ''}`}
          onClick={() => setFilter('food')}
        >
          Food
        </button>
      </div>

      {/* Active Offers Header */}
      <div className={styles.offersHeader}>
        <span className={styles.offersTitle}>ACTIVE OFFERS NEAR YOU</span>
        <span className={styles.liveCount}>6 live</span>
      </div>

      {/* Venue Cards Grid */}
      <div className={styles.offersGrid}>
        {/* Card 1 */}
        <div className={styles.card}>
          <div className={styles.cardImage}>
            <div className={styles.imagePlaceholder}>Venue photo</div>
            <div className={styles.timer}>
              <span>● LIVE</span>
              <span>2:30</span>
            </div>
            <div className={`${styles.badge} ${styles.drink}`}>DRINK</div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.distance}>0.3 mi</div>
            <h3>Aye Aye</h3>
            <p className={styles.description}>2 for 1 Margaritas</p>
            <p className={styles.address}>118 5th Ave</p>
            <div className={styles.cardActions}>
              <button className={styles.actionBtn}>⊞</button>
              <button className={styles.actionBtn}>📍</button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className={styles.card}>
          <div className={styles.cardImage}>
            <div className={styles.imagePlaceholder}>Venue photo</div>
            <div className={styles.timer}>
              <span>● LIVE</span>
              <span>1:45</span>
            </div>
            <div className={`${styles.badge} ${styles.food}`}>FOOD</div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.distance}>0.6 mi</div>
            <h3>241 Bar</h3>
            <p className={styles.description}>Wings Special</p>
            <p className={styles.address}>77 Harbor</p>
            <div className={styles.cardActions}>
              <button className={styles.actionBtn}>⊞</button>
              <button className={styles.actionBtn}>📍</button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className={styles.card}>
          <div className={styles.cardImage}>
            <div className={styles.imagePlaceholder}>Venue photo</div>
            <div className={styles.timer}>
              <span>● LIVE</span>
              <span>0:15</span>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.distance}>Nearby</div>
            <h3>The Hub</h3>
            <p className={styles.description}>Happy Hour</p>
            <p className={styles.address}>Downtown</p>
            <div className={styles.cardActions}>
              <button className={styles.actionBtn}>⊞</button>
              <button className={styles.actionBtn}>📍</button>
            </div>
          </div>
        </div>
      </div>

      {/* Sign In Section */}
      <div className={styles.signInSection}>
        <h2>Sign in to see all specials near you</h2>
        <button
          className={styles.signInBtn}
          onClick={() => router.push('/auth/signin')}
        >
          Sign In
        </button>
        <button
          className={styles.signUpBtn}
          onClick={() => router.push('/auth/signup')}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
