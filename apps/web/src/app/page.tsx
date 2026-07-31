'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [showVenueCta, setShowVenueCta] = useState(true);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroImage}>
          <div className={styles.imagePlaceholder}>🖼️ Hero — venue crowd / nightlife</div>
        </div>

        {/* Header: Logo + Menu (positioned over hero) */}
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <div className={styles.logoBadge}>NV</div>
            <span className={styles.logoLabel}>Nearby Vibes</span>
          </div>
          <button className={styles.menuIcon}>☰</button>
        </header>

        {/* Hero Text Overlay (bottom of hero) */}
        <div className={styles.heroTextOverlay}>
          <h1 className={styles.heroHeading}>Live Specials</h1>
          <p className={styles.heroSubheading}>Near You</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className={styles.navTabs}>
        <div className={styles.navTab}>
          <span className={styles.tabIcon}>⚡</span>
          <span>Live specials</span>
        </div>
        <div className={styles.navTab}>
          <span className={styles.tabIcon}>📍</span>
          <span>Nearby venues</span>
        </div>
        <div className={styles.navTab}>
          <span className={styles.tabIcon}>🔔</span>
          <span>Smart notify</span>
        </div>
      </nav>

      {/* Venue CTA */}
      {showVenueCta && (
        <div className={styles.venueCta}>
          <button
            className={styles.closeBtn}
            onClick={() => setShowVenueCta(false)}
          >
            ✕
          </button>
          <div className={styles.ctaIcon}>🛡️</div>
          <h2 className={styles.ctaTitle}>Own a Venue?</h2>
          <p className={styles.ctaDesc}>Get your venue live in minutes and reach more locals today.</p>
          <button
            className={styles.ctaBtn}
            onClick={() => router.push('/auth/signup?role=venue')}
          >
            Get Started →
          </button>
          <div className={styles.ctaBenefits}>
            <span>✓ 100% Free</span>
            <span>✓ Post in seconds</span>
            <span>✓ No commitment</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterSection}>
        <button className={`${styles.filterTab} ${styles.active}`}>All</button>
        <button className={styles.filterTab}>Drink</button>
        <button className={styles.filterTab}>Food</button>
      </div>

      {/* Offers Header */}
      <div className={styles.offersHeader}>
        <div>
          <h3 className={styles.offersTitle}>ACTIVE OFFERS NEAR YOU</h3>
          <span className={styles.distanceLabel}>&lt;0.75mi</span>
        </div>
        <span className={styles.liveCount}>6 live</span>
      </div>

      {/* Cards Grid */}
      <div className={styles.cardsGrid}>
        {/* Card 1 */}
        <div className={styles.card}>
          <div className={styles.cardImage}>
            <div className={styles.imagePlaceholder}>Venue photo</div>
            <div className={styles.timer}>
              <span className={styles.liveLabel}>● LIVE</span>
              <span>2:30</span>
            </div>
            <div className={`${styles.badge} ${styles.drink}`}>DRINK</div>
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.distance}>0.3 mi</div>
            <h4 className={styles.venueName}>Aye Aye</h4>
            <p className={styles.special}>2 for 1 Margaritas</p>
            <p className={styles.address}>118 5th Ave</p>
            <div className={styles.actions}>
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
              <span className={styles.liveLabel}>● LIVE</span>
              <span>1:45</span>
            </div>
            <div className={`${styles.badge} ${styles.food}`}>FOOD</div>
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.distance}>0.6 mi</div>
            <h4 className={styles.venueName}>241 Bar</h4>
            <p className={styles.special}>Wings Special</p>
            <p className={styles.address}>77 Harbor</p>
            <div className={styles.actions}>
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
              <span className={styles.liveLabel}>● LIVE</span>
              <span>0:15</span>
            </div>
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.distance}>Nearby</div>
            <h4 className={styles.venueName}>The Hub</h4>
            <p className={styles.special}>Happy Hour</p>
            <p className={styles.address}>Downtown</p>
            <div className={styles.actions}>
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
          className={styles.createBtn}
          onClick={() => router.push('/auth/signup')}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
