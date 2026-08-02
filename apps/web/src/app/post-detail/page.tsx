'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './post-detail.module.css';

interface Post {
  id: string;
  title: string;
  description: string;
  venue: {
    id: string;
    name: string;
    address: string;
    distance: number;
  };
  categories: string[];
  image?: string;
  expiresAt: string;
  hoursRemaining: number;
  restrictions?: string;
  terms?: string;
  views: number;
  saves: number;
  shares: number;
  saved?: boolean;
}

export default function PostDetailPage() {
  const router = useRouter();

  const [post] = useState<Post>({
    id: '1',
    title: '2 for 1 Margaritas',
    description: 'Premium margaritas - any flavor, buy one get one free. Valid all day today only.',
    venue: {
      id: 'venue_1',
      name: 'The Local Bar & Grill',
      address: '123 Main St',
      distance: 0.5,
    },
    categories: ['DRINK', 'HAPPY HOUR'],
    image: 'https://via.placeholder.com/400x300?text=2+for+1+Margaritas',
    expiresAt: '2024-07-31T23:59:59Z',
    hoursRemaining: 8,
    restrictions: '21+ only. Must show valid ID. One drink per person.',
    terms: 'Offer valid for dine-in only. Cannot combine with other offers. Limited to happy hour portion sizes.',
    views: 342,
    saves: 28,
    shares: 12,
    saved: false,
  });

  const [postState, setPostState] = useState(post);

  const handleSave = () => {
    setPostState({ ...postState, saved: !postState.saved });
  };

  const handleViewVenue = () => {
    router.push(`/venue-profile?id=${post.venue.id}`);
  };

  const handleNavigate = () => {
    // TODO: Open maps integration
    alert('Navigate to venue (would open maps)');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <h1 className={styles.title}>Special Details</h1>
        <div className={styles.spacer}></div>
      </header>

      <main className={styles.content}>
        {/* Hero Image */}
        <div className={styles.hero}>
          <img src={post.image} alt={post.title} />
        </div>

        {/* Timer */}
        <div className={styles.timer}>
          <span className={styles.liveIndicator}>● LIVE</span>
          <span className={styles.hoursLeft}>{post.hoursRemaining}h remaining</span>
        </div>

        {/* Title & Categories */}
        <div className={styles.titleSection}>
          <h2 className={styles.postTitle}>{post.title}</h2>
          <div className={styles.badges}>
            {post.categories.map((cat) => (
              <span
                key={cat}
                className={`${styles.badge} ${cat === 'DRINK' ? styles.drink : styles.food}`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <section className={styles.section}>
          <h3>About This Deal</h3>
          <p className={styles.description}>{post.description}</p>
        </section>

        {/* Venue Info */}
        <section className={styles.section}>
          <h3>Venue</h3>
          <div className={styles.venueCard}>
            <div>
              <h4 className={styles.venueName}>{post.venue.name}</h4>
              <p className={styles.venueAddress}>{post.venue.address}</p>
              <p className={styles.distance}>📍 {post.venue.distance.toFixed(1)} mi away</p>
            </div>
            <button className={styles.followBtn} onClick={handleViewVenue}>
              View Venue
            </button>
          </div>
        </section>

        {/* Restrictions */}
        {post.restrictions && (
          <section className={styles.section}>
            <h3>Restrictions</h3>
            <div className={styles.restrictions}>
              <p>{post.restrictions}</p>
            </div>
          </section>
        )}

        {/* Terms */}
        {post.terms && (
          <section className={styles.section}>
            <h3>Terms & Conditions</h3>
            <div className={styles.terms}>
              <p>{post.terms}</p>
            </div>
          </section>
        )}

        {/* Engagement */}
        <section className={styles.section}>
          <h3>This Post</h3>
          <div className={styles.engagementGrid}>
            <div className={styles.engagementCard}>
              <div className={styles.engagementValue}>{post.views}</div>
              <div className={styles.engagementLabel}>Views</div>
            </div>
            <div className={styles.engagementCard}>
              <div className={styles.engagementValue}>{post.saves}</div>
              <div className={styles.engagementLabel}>Saved</div>
            </div>
            <div className={styles.engagementCard}>
              <div className={styles.engagementValue}>{post.shares}</div>
              <div className={styles.engagementLabel}>Shared</div>
            </div>
          </div>
        </section>

        {/* CTA Buttons */}
        <div className={styles.actions}>
          <button className={styles.navigateBtn} onClick={handleNavigate}>
            📍 Navigate
          </button>
          <button
            className={`${styles.saveBtn} ${postState.saved ? styles.saved : ''}`}
            onClick={handleSave}
          >
            {postState.saved ? '♥ Saved' : '♡ Save'}
          </button>
          <button className={styles.shareBtn}>
            📤 Share
          </button>
        </div>

        {/* Footer Info */}
        <div className={styles.footer}>
          <p>
            Expires: {new Date(post.expiresAt).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  );
}
