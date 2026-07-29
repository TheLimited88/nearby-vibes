'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import styles from './dashboard.module.css';

interface VenueStats {
  total_views: number;
  total_clicks: number;
  total_redemptions: number;
  active_posts: number;
  followers: number;
  week_over_week_growth: number;
}

export default function VenueDashboard() {
  const router = useRouter();
  const { user: authUser, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<VenueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated() || authUser?.role !== 'venue') {
      router.push('/');
      return;
    }

    loadStats();
  }, [isAuthenticated, authUser, router]);

  const loadStats = async () => {
    try {
      setLoading(true);
      // TODO: Fetch actual stats from API
      setStats({
        total_views: 1250,
        total_clicks: 340,
        total_redemptions: 89,
        active_posts: 3,
        followers: 156,
        week_over_week_growth: 23,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Venue Dashboard</h1>
        <div className={styles.actions}>
          <Button onClick={() => router.push('/venue/posts/create')}>
            Create Post
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push('/account')}
          >
            Account
          </Button>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading dashboard...</div>
      ) : !stats ? (
        <div className={styles.error}>Failed to load stats</div>
      ) : (
        <>
          <div className={styles.grid}>
            <Card className={styles.statCard}>
              <p className={styles.label}>Total Views</p>
              <p className={styles.value}>{stats.total_views.toLocaleString()}</p>
            </Card>

            <Card className={styles.statCard}>
              <p className={styles.label}>Clicks</p>
              <p className={styles.value}>{stats.total_clicks.toLocaleString()}</p>
            </Card>

            <Card className={styles.statCard}>
              <p className={styles.label}>Redemptions</p>
              <p className={styles.value}>{stats.total_redemptions.toLocaleString()}</p>
            </Card>

            <Card className={styles.statCard}>
              <p className={styles.label}>Followers</p>
              <p className={styles.value}>{stats.followers.toLocaleString()}</p>
            </Card>

            <Card className={styles.statCard}>
              <p className={styles.label}>Active Posts</p>
              <p className={styles.value}>{stats.active_posts}</p>
            </Card>

            <Card className={styles.statCard}>
              <p className={styles.label}>Growth (WoW)</p>
              <p className={`${styles.value} ${styles.positive}`}>
                +{stats.week_over_week_growth}%
              </p>
            </Card>
          </div>

          <Card className={styles.section}>
            <h2>Quick Actions</h2>
            <div className={styles.actions}>
              <Button onClick={() => router.push('/venue/posts')}>
                Manage Posts
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/venue/analytics')}
              >
                View Analytics
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/venue/settings')}
              >
                Settings
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
