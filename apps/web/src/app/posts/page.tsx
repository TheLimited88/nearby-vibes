'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './posts.module.css';

interface Post {
  id: string;
  title: string;
  description: string;
  venue_name: string;
  address: string;
  image_url: string;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  start_time: string;
  end_time: string;
  time_remaining_minutes: number;
  category: 'drink' | 'food';
}

export default function PostsPage() {
  const router = useRouter();
  const [activePost, setActivePost] = useState<Post | null>(null);

  // Mock data
  const posts: Post[] = [
    {
      id: '1',
      title: '2 for 1 Margaritas',
      description: 'Happy hour special - buy one get one free on all margaritas',
      venue_name: 'Aye Aye Bar',
      address: '118 5th Ave',
      image_url: '',
      discount_amount: 50,
      discount_type: 'percentage',
      start_time: new Date().toLocaleString(),
      end_time: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toLocaleString(),
      time_remaining_minutes: 150,
      category: 'drink',
    },
    {
      id: '2',
      title: 'Half-Price Wings',
      description: 'All wings 50% off - dine-in only',
      venue_name: '241 Bar',
      address: '241 Main St',
      image_url: '',
      discount_amount: 50,
      discount_type: 'percentage',
      start_time: new Date().toLocaleString(),
      end_time: new Date(Date.now() + 1.75 * 60 * 60 * 1000).toLocaleString(),
      time_remaining_minutes: 105,
      category: 'food',
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

      <h1 className={styles.title}>Active Specials</h1>

      <div className={styles.postsList}>
        {posts.map((post) => (
          <div
            key={post.id}
            className={styles.postCard}
            onClick={() => setActivePost(post)}
          >
            <div className={styles.postImage}>
              <div className={styles.imagePlaceholder}></div>
              <div className={styles.timer}>
                <span className={styles.liveLabel}>● LIVE</span>
                <span>{Math.floor(post.time_remaining_minutes / 60)}:{String(post.time_remaining_minutes % 60).padStart(2, '0')}</span>
              </div>
              <div className={`${styles.badge} ${styles[post.category]}`}>
                {post.category.toUpperCase()}
              </div>
            </div>
            <div className={styles.postInfo}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.venueName}>{post.venue_name}</p>
              <p className={styles.description}>{post.description}</p>
              <p className={styles.address}>{post.address}</p>
              <div className={styles.discount}>
                {post.discount_amount}{post.discount_type === 'percentage' ? '%' : '$'} off
              </div>
            </div>
          </div>
        ))}
      </div>

      {activePost && (
        <div className={styles.modalOverlay} onClick={() => setActivePost(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setActivePost(null)}
            >
              ✕
            </button>
            <div className={styles.modalImage}></div>
            <div className={styles.modalContent}>
              <h2>{activePost.title}</h2>
              <p className={styles.modalVenue}>{activePost.venue_name}</p>
              <p className={styles.modalAddress}>{activePost.address}</p>
              <div className={styles.modalDescription}>{activePost.description}</div>
              <div className={styles.modalFooter}>
                <div>Active Window</div>
                <div>{activePost.start_time} - {activePost.end_time}</div>
              </div>
              <button className={styles.ctaBtn}>Navigate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
