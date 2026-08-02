'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './following-venues.module.css';

interface Venue {
  id: string;
  name: string;
  address: string;
  image_url: string;
  distance_miles: number;
  active_specials: number;
}

export default function FollowingVenuesPage() {
  const router = useRouter();

  const venues: Venue[] = [
    {
      id: '1',
      name: 'Aye Aye Bar',
      address: '118 5th Ave',
      image_url: '',
      distance_miles: 0.3,
      active_specials: 2,
    },
    {
      id: '2',
      name: '241 Bar',
      address: '241 Main St',
      image_url: '',
      distance_miles: 0.6,
      active_specials: 1,
    },
    {
      id: '3',
      name: 'The Hub',
      address: 'Downtown',
      image_url: '',
      distance_miles: 0.7,
      active_specials: 3,
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
      </header>

      <h1 className={styles.title}>Following Venues</h1>

      <div className={styles.venuesList}>
        {venues.map((venue) => (
          <div
            key={venue.id}
            className={styles.venueCard}
            onClick={() => router.push(`/venue/${venue.id}`)}
          >
            <div className={styles.venueImage}></div>
            <div className={styles.venueInfo}>
              <h3 className={styles.venueName}>{venue.name}</h3>
              <p className={styles.address}>{venue.address}</p>
              <div className={styles.meta}>
                <span className={styles.distance}>{venue.distance_miles} mi</span>
                <span className={styles.specials}>{venue.active_specials} active</span>
              </div>
            </div>
            <div className={styles.arrow}>→</div>
          </div>
        ))}
      </div>

      {venues.length === 0 && (
        <div className={styles.empty}>
          <p>You're not following any venues yet.</p>
          <button
            className={styles.ctaBtn}
            onClick={() => router.push('/')}
          >
            Explore Venues
          </button>
        </div>
      )}
    </div>
  );
}
