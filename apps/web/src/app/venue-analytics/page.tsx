'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './venue-analytics.module.css';

interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  icon: string;
}

export default function VenueAnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('week');

  const metrics: MetricCard[] = [
    { label: 'Total Reach', value: 1240, change: '+12%', icon: '👥' },
    { label: 'Engagement', value: '18%', change: '+3%', icon: '💬' },
    { label: 'Trial Followers', value: 42, change: '+8', icon: '⭐' },
    { label: 'Conversions', value: 28, change: '+5', icon: '✓' },
  ];

  const topPosts = [
    { title: '2 for 1 Margaritas', reach: 342, engagement: 62 },
    { title: 'Happy Hour Special', reach: 218, engagement: 38 },
    { title: 'Half-Price Wings', reach: 156, engagement: 24 },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
        <h1 className={styles.title}>Analytics</h1>
      </header>

      <main className={styles.content}>
        {/* Time Range Selector */}
        <div className={styles.timeRangeSelector}>
          {['week', 'month', 'all'].map((range) => (
            <button
              key={range}
              className={`${styles.timeBtn} ${timeRange === range ? styles.active : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          {metrics.map((metric, idx) => (
            <div key={idx} className={styles.metricCard}>
              <div className={styles.metricIcon}>{metric.icon}</div>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={styles.metricChange}>{metric.change}</div>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <section className={styles.section}>
          <h2>Performance Trend</h2>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chart}>
              <div className={styles.bar} style={{ height: '40%' }}></div>
              <div className={styles.bar} style={{ height: '60%' }}></div>
              <div className={styles.bar} style={{ height: '35%' }}></div>
              <div className={styles.bar} style={{ height: '80%' }}></div>
              <div className={styles.bar} style={{ height: '55%' }}></div>
            </div>
            <p className={styles.chartLabel}>Engagement over time</p>
          </div>
        </section>

        {/* Top Posts */}
        <section className={styles.section}>
          <h2>Top Performing Posts</h2>
          <div className={styles.postsList}>
            {topPosts.map((post, idx) => (
              <div key={idx} className={styles.postRow}>
                <div className={styles.postRank}>{idx + 1}</div>
                <div className={styles.postDetails}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postStats}>
                    {post.reach} reach · {post.engagement}% engagement
                  </p>
                </div>
                <div className={styles.postArrow}>→</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
