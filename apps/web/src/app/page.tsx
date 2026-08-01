'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [showVenueCta, setShowVenueCta] = useState(true);
  const [filterActive, setFilterActive] = useState('all');

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroImage}>🖼️ Hero — venue crowd / nightlife</div>
        <div className={styles.heroGradient}></div>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src="/nv-icon.png" alt="NV" style={{ height: 32 }} />
            <span>Nearby Vibes</span>
          </div>
          <button className={styles.menuBtn}>☰</button>
        </header>

        {/* Hero Text */}
        <div className={styles.heroTextBlock}>
          <div className={styles.heroTextLine1}>Live Specials</div>
          <div className={styles.heroTextLine2}>Near You</div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Venue CTA */}
        {showVenueCta && (
          <div className={styles.ctaCard}>
            <button className={styles.closeCtaBtn} onClick={() => setShowVenueCta(false)}>✕</button>
            <div className={styles.ctaContent}>
              <div className={styles.ctaIcon}>🛡️</div>
              <h2 className={styles.ctaHeading}>Own a Venue?</h2>
              <p className={styles.ctaDescription}>Get your venue live in minutes and reach more locals today.</p>
              <a href="/auth/signup?role=venue" className={styles.ctaButtonLink}>Get Started →</a>
              <div className={styles.ctaFeatures}>
                <span>✓ 100% Free</span>
                <span>✓ Post in seconds</span>
                <span>✓ No commitment</span>
              </div>
            </div>
          </div>
        )}

        {/* Offers Header */}
        <div className={styles.offersHeaderSection}>
          <div className={styles.offersHeaderLeft}>
            <span className={styles.offersTitle}>ACTIVE OFFERS NEAR YOU</span>
            <span className={styles.distanceBadge}>&lt;0.75mi</span>
          </div>
          <span className={styles.liveBadge}>6 live</span>
        </div>

        {/* Filters */}
        <div className={styles.filterBar}>
          <button
            className={`${styles.filterButton} ${filterActive === 'all' ? styles.active : ''}`}
            onClick={() => setFilterActive('all')}
          >
            All
          </button>
          <button
            className={`${styles.filterButton} ${filterActive === 'drink' ? styles.active : ''}`}
            onClick={() => setFilterActive('drink')}
          >
            Drinks
          </button>
          <button
            className={`${styles.filterButton} ${filterActive === 'food' ? styles.active : ''}`}
            onClick={() => setFilterActive('food')}
          >
            Food
          </button>
        </div>

        {/* Horizontal Scroll Cards */}
        <div className={styles.cardsScroll}>
          {/* Card 1 */}
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <div className={styles.imagePlaceholder}>Venue photo</div>
              <div className={styles.distanceTag}>0.3 mi</div>
              <div className={styles.categoryBadgeDrink}>DRINK</div>
              <div className={styles.liveIndicator}>
                <span className={styles.liveDot}>●</span>
                <span className={styles.liveText}>LIVE</span>
                <span className={styles.timer}>2:30</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: '68%'}}></div>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.venueName}>Aye Aye</div>
              <div className={styles.specialTitle}>2 for 1 Margaritas</div>
              <div className={styles.address}>118 5th Ave</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <div className={styles.imagePlaceholder}>Venue photo</div>
              <div className={styles.distanceTag}>0.6 mi</div>
              <div className={styles.categoryBadgeFood}>FOOD</div>
              <div className={styles.liveIndicator}>
                <span className={styles.liveDot}>●</span>
                <span className={styles.liveText}>LIVE</span>
                <span className={styles.timer}>1:45</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: '28%'}}></div>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.venueName}>241 Bar</div>
              <div className={styles.specialTitle}>Wings Special</div>
              <div className={styles.address}>77 Harbor</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <div className={styles.imagePlaceholder}>Venue photo</div>
              <div className={styles.distanceTag}>Nearby</div>
              <div className={styles.categoryBadgeFood}>FOOD</div>
              <div className={styles.liveIndicator}>
                <span className={styles.liveDot}>●</span>
                <span className={styles.liveText}>LIVE</span>
                <span className={styles.timer}>0:15</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: '15%'}}></div>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.venueName}>The Hub</div>
              <div className={styles.specialTitle}>Happy Hour</div>
              <div className={styles.address}>Downtown</div>
            </div>
          </div>
        </div>

        {/* Sign In Section */}
        <div className={styles.signInSection}>
          <h2>Sign in to see all specials near you</h2>
          <a href="/auth/signin" className={styles.signInButton}>Sign In</a>
          <a href="/auth/signup" className={styles.createButton}>Create Account</a>
        </div>
      </div>
    </div>
  );
}
