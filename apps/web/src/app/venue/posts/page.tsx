'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { postsAPI } from '@/lib/apiClient';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import styles from './posts.module.css';

interface Post {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'expired' | 'cancelled';
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  start_time: string;
  end_time: string;
  view_count: number;
  click_count: number;
  redeem_count: number;
}

export default function PostsList() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'expired'>(
    'all'
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin?role=venue');
      return;
    }

    loadPosts();
  }, [isAuthenticated, router]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      // TODO: Fetch from API when available
      setPosts([]);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (postId: string) => {
    try {
      await postsAPI.publishPost(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to publish post:', error);
    }
  };

  const handleCancel = async (postId: string) => {
    if (confirm('Cancel this post? This cannot be undone.')) {
      try {
        await postsAPI.cancelPost(postId);
        loadPosts();
      } catch (error) {
        console.error('Failed to cancel post:', error);
      }
    }
  };

  const filteredPosts =
    filter === 'all'
      ? posts
      : posts.filter((p) => p.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return styles.statusPublished;
      case 'draft':
        return styles.statusDraft;
      case 'expired':
        return styles.statusExpired;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={styles.container}>
      <header className={styles.topHeader}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>NV</div>
          <span className={styles.logoText}>Nearby Vibes</span>
        </div>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
      </header>

      <div className={styles.header}>
        <h1>Your Specials</h1>
        <Button onClick={() => router.push('/venue/posts/create')}>
          Create New Special
        </Button>
      </div>

      <div className={styles.filters}>
        {(['all', 'draft', 'published', 'expired'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'secondary'}
            onClick={() => setFilter(f)}
            size="sm"
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className={styles.empty}>Loading your specials...</div>
      ) : filteredPosts.length === 0 ? (
        <div className={styles.empty}>
          <p>No specials yet</p>
          <Button onClick={() => router.push('/venue/posts/create')}>
            Create your first special
          </Button>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {filteredPosts.map((post) => (
            <Card key={post.id} className={styles.postCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleSection}>
                  <h3>{post.title}</h3>
                  <span className={`${styles.status} ${getStatusColor(post.status)}`}>
                    {post.status.toUpperCase()}
                  </span>
                </div>

                <div className={styles.discount}>
                  {post.discount_amount}
                  {post.discount_type === 'percentage' ? '%' : '$'} off
                </div>
              </div>

              <p className={styles.description}>{post.description}</p>

              <div className={styles.timing}>
                <div className={styles.timeBlock}>
                  <span className={styles.timeLabel}>Starts</span>
                  <span className={styles.timeValue}>{formatTime(post.start_time)}</span>
                </div>
                <div className={styles.timeBlock}>
                  <span className={styles.timeLabel}>Ends</span>
                  <span className={styles.timeValue}>{formatTime(post.end_time)}</span>
                </div>
              </div>

              <div className={styles.analytics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Views</span>
                  <span className={styles.metricValue}>{post.view_count}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Clicks</span>
                  <span className={styles.metricValue}>{post.click_count}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Redeemed</span>
                  <span className={styles.metricValue}>{post.redeem_count}</span>
                </div>
              </div>

              <div className={styles.actions}>
                {post.status === 'draft' && (
                  <Button
                    size="sm"
                    onClick={() => handlePublish(post.id)}
                  >
                    Publish
                  </Button>
                )}
                {post.status === 'published' && (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => router.push(`/venue/posts/${post.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(post.id)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => router.push(`/venue/posts/${post.id}/analytics`)}
                >
                  Analytics
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
