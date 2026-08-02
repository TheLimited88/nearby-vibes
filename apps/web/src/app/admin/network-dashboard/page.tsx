'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin-network-dashboard.module.css';

export default function NetworkDashboardPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('month');

  const stats = [
    { label: 'Total Users', value: 2847, change: '+142', icon: '👥' },
    { label: 'Active Venues', value: 342, change: '+28', icon: '🏢' },
    { label: 'Posts This Month', value: 1256, change: '+324', icon: '📝' },
    { label: 'Total Reach', value: '89.4K', change: '+15K', icon: '📊' },
  ];

  const engagement = [
    { label: 'Avg Post Engagement', value: '34%', change: '+4%', icon: '💬' },
    { label: 'New Followers', value: 4821, change: '+512', icon: '⭐' },
    { label: 'Trial Conversions', value: '28%', change: '+2%', icon: '✓' },
    { label: 'Churn Rate', value: '2.1%', change: '-0.3%', icon: '📉' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
        <h1 className={styles.title}>Network Dashboard</h1>
      </header>

      <main className={styles.content}>
        {/* Time Range */}
        <div className={styles.timeRange}>
          {['week', 'month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              className={`${styles.rangeBtn} ${timeRange === range ? styles.active : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : range === 'quarter' ? 'This Quarter' : 'This Year'}
            </button>
          ))}
        </div>

        {/* Primary Metrics */}
        <section className={styles.section}>
          <h2>Platform Metrics</h2>
          <div className={styles.metricsGrid}>
            {stats.map((stat, idx) => (
              <div key={idx} className={styles.metricCard}>
                <div className={styles.metricIcon}>{stat.icon}</div>
                <div className={styles.metricLabel}>{stat.label}</div>
                <div className={styles.metricValue}>{stat.value}</div>
                <div className={styles.metricChange}>{stat.change}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Engagement Metrics */}
        <section className={styles.section}>
          <h2>Engagement & Growth</h2>
          <div className={styles.metricsGrid}>
            {engagement.map((metric, idx) => (
              <div key={idx} className={styles.metricCard}>
                <div className={styles.metricIcon}>{metric.icon}</div>
                <div className={styles.metricLabel}>{metric.label}</div>
                <div className={styles.metricValue}>{metric.value}</div>
                <div className={styles.metricChange}>{metric.change}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Growth Trend */}
        <section className={styles.section}>
          <h2>User Growth Trend</h2>
          <div className={styles.chartContainer}>
            <div className={styles.chart}>
              <div className={styles.bar} style={{ height: '20%' }}></div>
              <div className={styles.bar} style={{ height: '35%' }}></div>
              <div className={styles.bar} style={{ height: '45%' }}></div>
              <div className={styles.bar} style={{ height: '60%' }}></div>
              <div className={styles.bar} style={{ height: '70%' }}></div>
              <div className={styles.bar} style={{ height: '85%' }}></div>
              <div className={styles.bar} style={{ height: '90%' }}></div>
            </div>
            <div className={styles.chartLabels}>
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Week 5</span>
              <span>Week 6</span>
              <span>Week 7</span>
            </div>
          </div>
        </section>

        {/* Top Venues */}
        <section className={styles.section}>
          <h2>Top Performing Venues</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Venue Name</th>
                  <th>Followers</th>
                  <th>Posts</th>
                  <th>Engagement</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>The Local Bar</td>
                  <td>1,240</td>
                  <td>42</td>
                  <td>45%</td>
                  <td>$12,450</td>
                </tr>
                <tr>
                  <td>Sports Hub Downtown</td>
                  <td>1,120</td>
                  <td>38</td>
                  <td>38%</td>
                  <td>$10,800</td>
                </tr>
                <tr>
                  <td>The Craft Kitchen</td>
                  <td>980</td>
                  <td>35</td>
                  <td>42%</td>
                  <td>$9,650</td>
                </tr>
                <tr>
                  <td>Night Club Paradise</td>
                  <td>850</td>
                  <td>28</td>
                  <td>35%</td>
                  <td>$7,200</td>
                </tr>
                <tr>
                  <td>Burger & Brew Co</td>
                  <td>720</td>
                  <td>24</td>
                  <td>32%</td>
                  <td>$5,800</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Locations */}
        <section className={styles.section}>
          <h2>Top Locations by User Activity</h2>
          <div className={styles.locationsList}>
            {[
              { city: 'Downtown', users: 1240, venues: 45, posts: 324 },
              { city: 'Uptown', users: 1050, venues: 38, posts: 287 },
              { city: 'Westside', users: 850, venues: 28, posts: 198 },
              { city: 'North District', users: 720, venues: 23, posts: 156 },
              { city: 'Southside', users: 620, venues: 18, posts: 128 },
            ].map((loc, idx) => (
              <div key={idx} className={styles.locationCard}>
                <div className={styles.locationInfo}>
                  <h4 className={styles.locationName}>{loc.city}</h4>
                  <div className={styles.locationStats}>
                    <span>{loc.users} users</span>
                    <span>{loc.venues} venues</span>
                    <span>{loc.posts} posts</span>
                  </div>
                </div>
                <div className={styles.locationBar}>
                  <div
                    className={styles.bar}
                    style={{ width: (loc.users / 1240) * 100 + '%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
