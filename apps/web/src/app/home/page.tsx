'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/Button';
import styles from './home.module.css';

export default function HomePage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>NV</div>
          <span className={styles.logoText}>Nearby Vibes</span>
        </div>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </header>

      {/* Menu Dropdown */}
      {menuOpen && (
        <div className={styles.menu}>
          <button onClick={() => router.push('/account')} className={styles.menuItem}>
            My Account
          </button>
          <button onClick={() => router.push('/account/subscription')} className={styles.menuItem}>
            Preferences
          </button>
          <div className={styles.menuDivider} />
          <button onClick={logout} className={styles.menuItemDanger}>
            Sign Out
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Live Specials</h1>
          <p className={styles.heroSubtitle}>Near You</p>
          <p className={styles.heroDescription}>
            Discover drink and food specials happening now at venues nearby
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className={styles.navTabs}>
        <button className={styles.tab}>
          <span className={styles.tabIcon}>⚡</span>
          <span>Live specials</span>
        </button>
        <button className={styles.tab}>
          <span className={styles.tabIcon}>📍</span>
          <span>Nearby venues</span>
        </button>
        <button className={styles.tab}>
          <span className={styles.tabIcon}>🔔</span>
          <span>Smart notify</span>
        </button>
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
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.card}>
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
                <h3>Venue Name</h3>
                <p className={styles.address}>Special Description</p>
                <p className={styles.venue}>Address</p>
                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}>⊞</button>
                  <button className={styles.actionBtn}>📍</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2>Ready to find more specials?</h2>
        <Button onClick={() => router.push('/auth/signin')}>
          Explore More
        </Button>
      </section>
    </div>
  );
}
