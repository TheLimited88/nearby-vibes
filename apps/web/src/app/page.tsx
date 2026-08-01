'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [showVenueCta, setShowVenueCta] = useState(true);
  const [filterActive, setFilterActive] = useState('all');

  const offers = [
    {
      id: 1,
      name: 'Aye Aye',
      title: '2 for 1 Margaritas',
      address: '118 5th Ave',
      distance: '0.3 mi',
      category: 'DRINK',
      time: '2:30',
    },
    {
      id: 2,
      name: '241 Bar',
      title: 'Wings Special',
      address: '77 Harbor',
      distance: '0.6 mi',
      category: 'FOOD',
      time: '1:45',
    },
    {
      id: 3,
      name: 'The Hub',
      title: 'Happy Hour',
      address: 'Downtown',
      distance: 'Nearby',
      category: 'FOOD',
      time: '0:15',
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroImage}>🖼️ Hero — venue crowd / nightlife</div>
        <div className={styles.heroGradient}></div>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src="/nv-icon.png" alt="Nearby Vibes" style={{ height: 32, width: 'auto' }} />
            <span>Nearby Vibes</span>
          </div>
          <button className={styles.menuBtn}>☰</button>
        </header>

        {/* Hero Text */}
        <div className={styles.heroText}>
          <h1 className={styles.heading}>Live Specials</h1>
          <p className={styles.subheading}>Near You</p>
        </div>
      </div>

      {/* Venue CTA Card */}
      {showVenueCta && (
        <div className={styles.ctaCard}>
          <button
            className={styles.closeBtn}
            onClick={() => setShowVenueCta(false)}
          >
            ✕
          </button>
          <div className={styles.ctaIcon}>🛡️</div>
          <h2 className={styles.ctaTitle}>Own a Venue?</h2>
          <p className={styles.ctaDesc}>Get your venue live in minutes and reach more locals today.</p>
          <button className={styles.ctaButton}>Get Started →</button>
          <div className={styles.ctaBullets}>
            <span>✓ 100% Free</span>
            <span>✓ Post in seconds</span>
            <span>✓ No commitment</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filterActive === 'all' ? styles.active : ''}`}
          onClick={() => setFilterActive('all')}
        >
          All
        </button>
        <button
          className={`${styles.filterBtn} ${filterActive === 'drink' ? styles.active : ''}`}
          onClick={() => setFilterActive('drink')}
        >
          Drink
        </button>
        <button
          className={`${styles.filterBtn} ${filterActive === 'food' ? styles.active : ''}`}
          onClick={() => setFilterActive('food')}
        >
          Food
        </button>
      </div>

      {/* Active Offers */}
      <div className={styles.offersHeader}>
        <span>ACTIVE OFFERS NEAR YOU</span>
        <span className={styles.count}>6 live</span>
      </div>

      {/* Offer Cards */}
      <div className={styles.offersList}>
        {offers.map((offer) => (
          <div key={offer.id} className={styles.offerCard}>
            <div className={styles.cardImage}>
              Venue photo
              <div className={styles.categoryBadge}>{offer.category}</div>
              <div className={styles.distance}>{offer.distance}</div>
              <div className={styles.liveIndicator}>
                <span className={styles.liveDot}>●</span>
                <span>LIVE</span>
                <span>{offer.time}</span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.venueName}>{offer.name}</div>
              <div className={styles.offerTitle}>{offer.title}</div>
              <div className={styles.address}>{offer.address}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sign In Prompt */}
      <div className={styles.signInSection}>
        <p>Sign in to see all specials near you</p>
        <div className={styles.authButtons}>
          <button className={styles.signInBtn}>Sign In</button>
          <button className={styles.createAccountBtn}>Create Account</button>
        </div>
      </div>

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
