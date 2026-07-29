'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { discoveryAPI } from '@/lib/apiClient';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import styles from './home.module.css';

interface Post {
  id: string;
  venue_id: string;
  title: string;
  description: string;
  image_url?: string;
  start_time: string;
  end_time: string;
  discount_amount?: number;
  discount_type?: 'percentage' | 'fixed';
  view_count: number;
  click_count: number;
  redeem_count: number;
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'tile' | 'map'>('tile');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    loadFeed();
  }, [isAuthenticated, router]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await discoveryAPI.getPersonalizedFeed();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRemaining = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, end - now);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Nearby Specials</h1>
        <div className={styles.headerActions}>
          <Button
            variant={viewMode === 'tile' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('tile')}
            size="sm"
          >
            Tiles
          </Button>
          <Button
            variant={viewMode === 'map' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('map')}
            size="sm"
          >
            Map
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push('/account')}
            size="sm"
          >
            Account
          </Button>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading specials...</div>
      ) : posts.length === 0 ? (
        <div className={styles.empty}>
          <p>No specials found nearby</p>
          <Button onClick={loadFeed}>Refresh</Button>
        </div>
      ) : (
        <div className={viewMode === 'tile' ? styles.grid : styles.listView}>
          {posts.map((post) => (
            <Card
              key={post.id}
              className={styles.postCard}
              onClick={() => router.push(`/posts/${post.id}`)}
            >
              {post.image_url && (
                <div className={styles.image}>
                  <img src={post.image_url} alt={post.title} />
                  <div className={styles.timer}>
                    <span className={styles.liveIndicator}>● LIVE</span>
                    <span>{timeRemaining(post.end_time)} left</span>
                  </div>
                </div>
              )}

              <div className={styles.content}>
                <h3>{post.title}</h3>
                <p className={styles.description}>{post.description}</p>

                {post.discount_amount && (
                  <div className={styles.discount}>
                    <span className={styles.amount}>
                      {post.discount_type === 'percentage'
                        ? `${post.discount_amount}% off`
                        : `$${post.discount_amount} off`}
                    </span>
                  </div>
                )}

                <div className={styles.stats}>
                  <span>{post.view_count} views</span>
                  <span>{post.click_count} interested</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
