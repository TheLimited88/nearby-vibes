'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './venue-profile.module.css';

interface Post {
  id: string;
  title: string;
  image_url: string;
  time_remaining: number;
  category: 'drink' | 'food';
}

export default function VenueProfilePage() {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  const venueName = 'Aye Aye Bar';
  const veneAddress = '118 5th Ave, San Francisco, CA';
  const rating = 4.5;
  const followers = 342;
  const phone = '(415) 555-1234';
  const website = 'www.ayeayebrr.com';

  const posts: Post[] = [
    {
      id: '1',
      title: '2 for 1 Margaritas',
      image_url: '',
      time_remaining: 150,
      category: 'drink',
    },
    {
      id: '2',
      title: 'Happy Hour 5-7pm',
      image_url: '',
      time_remaining: 45,
      category: 'drink',
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
      </header>

      <main className={styles.content}>
        {/* Venue Header */}
        <section className={styles.venueHeader}>
          <div className={styles.venueImage}></div>
          <div className={styles.venueInfo}>
            <h1 className={styles.venueName}>{venueName}</h1>
            <p className={styles.address}>{veneAddress}</p>
            <div className={styles.meta}>
              <span className={styles.rating}>⭐ {rating}</span>
              <span className={styles.followers}>{followers} followers</span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? '✓ Following' : '+ Follow'}
          </button>
          <button className={styles.contactBtn}>Contact</button>
        </div>

        {/* Contact Info */}
        <section className={styles.contactSection}>
          <h2>Contact Info</h2>
          <a href={`tel:${phone}`} className={styles.contactLink}>
            {phone}
          </a>
          <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
            {website}
          </a>
        </section>

        {/* Active Specials */}
        <section className={styles.specialsSection}>
          <h2>Active Specials ({posts.length})</h2>
          <div className={styles.postsList}>
            {posts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postImage}></div>
                <div className={styles.postInfo}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <div className={styles.postMeta}>
                    <span className={`${styles.badge} ${styles[post.category]}`}>
                      {post.category.toUpperCase()}
                    </span>
                    <span className={styles.timeRemaining}>
                      {Math.floor(post.time_remaining / 60)}h {post.time_remaining % 60}m left
                    </span>
                  </div>
                </div>
                <div className={styles.timer}>
                  ⏱️
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hours */}
        <section className={styles.section}>
          <h2>Hours</h2>
          <div className={styles.hours}>
            <div className={styles.hour}>
              <span>Mon - Thu</span>
              <span>5 PM - 2 AM</span>
            </div>
            <div className={styles.hour}>
              <span>Fri - Sat</span>
              <span>5 PM - 3 AM</span>
            </div>
            <div className={styles.hour}>
              <span>Sunday</span>
              <span>6 PM - 2 AM</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
