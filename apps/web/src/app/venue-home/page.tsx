'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import styles from './venue-home.module.css';

interface Stat {
  label: string;
  value: string | number;
  trend?: string;
}

export default function VenueHomePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const stats: Stat[] = [
    { label: 'Active Posts', value: 2, trend: '+1 today' },
    { label: 'Total Reach', value: 342, trend: '+42 today' },
    { label: 'Engagement Rate', value: '18%', trend: '+3%' },
    { label: 'Trial Followers', value: 28, trend: '+5 this week' },
  ];

  const recentPosts = [
    { id: '1', title: '2 for 1 Margaritas', engagement: 42, live: true },
    { id: '2', title: 'Happy Hour Special', engagement: 28, live: false },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
          <span className={styles.logoText}>Nearby Vibes</span>
        </div>
        <button
          className={styles.menuBtn}
          onClick={() => router.push('/my-account')}
        >
          ☰
        </button>
      </header>

      <main className={styles.content}>
        <section className={styles.welcome}>
          <h1 className={styles.title}>Welcome back, {user?.display_name || 'Venue'}</h1>
          <p className={styles.subtitle}>Your venue dashboard</p>
        </section>

        <section className={styles.stats}>
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue}>{stat.value}</div>
              {stat.trend && <div className={styles.statTrend}>{stat.trend}</div>}
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Posts</h2>
            <button
              className={styles.createBtn}
              onClick={() => router.push('/venue/posts/create')}
            >
              + New Post
            </button>
          </div>
          <div className={styles.postsList}>
            {recentPosts.map((post) => (
              <div key={post.id} className={styles.postRow}>
                <div className={styles.postInfo}>
                  <div className={styles.postTitle}>{post.title}</div>
                  {post.live && <span className={styles.liveBadge}>● LIVE</span>}
                </div>
                <div className={styles.postEngagement}>{post.engagement} engagement</div>
                <button
                  className={styles.rowBtn}
                  onClick={() => router.push(`/venue/posts/${post.id}`)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Links</h2>
          <div className={styles.linkGrid}>
            <button
              className={styles.linkCard}
              onClick={() => router.push('/venue/analytics')}
            >
              <div className={styles.linkIcon}>📊</div>
              <div className={styles.linkLabel}>Analytics</div>
            </button>
            <button
              className={styles.linkCard}
              onClick={() => router.push('/venue/posts')}
            >
              <div className={styles.linkIcon}>📝</div>
              <div className={styles.linkLabel}>My Posts</div>
            </button>
            <button
              className={styles.linkCard}
              onClick={() => router.push('/venue/settings')}
            >
              <div className={styles.linkIcon}>⚙️</div>
              <div className={styles.linkLabel}>Settings</div>
            </button>
            <button
              className={styles.linkCard}
              onClick={() => router.push('/venue/qr')}
            >
              <div className={styles.linkIcon}>📱</div>
              <div className={styles.linkLabel}>QR Codes</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
