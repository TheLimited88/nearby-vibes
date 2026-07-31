'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { discoveryAPI } from '@/lib/apiClient';
import { Button } from '@/components/Button';
import styles from './home.module.css';

interface Post {
  id: string;
  venue_id: string;
  venue_name?: string;
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicFeed();
  }, []);

  const loadPublicFeed = async () => {
    try {
      setLoading(true);
      try {
        const response = await discoveryAPI.getPublicPosts();
        setPosts(response.data.posts || response.data || []);
      } catch {
        // Fallback to popular venues if public posts endpoint doesn't exist
        const response = await discoveryAPI.getPopularVenues();
        setPosts(response.data.posts || response.data || []);
      }
    } catch (error) {
      console.error('Failed to load feed:', error);
      setPosts([]);
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
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.navBar}>
            <div className={styles.logo}>🍹 Nearby Vibes</div>
            <button className={styles.menuBtn} onClick={() => router.push('/auth/signin')}>
              ☰
            </button>
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Live Specials</h1>
            <p className={styles.heroSubtitle}>Near You</p>
          </div>
        </div>
      </section>

      {/* Venue CTA Card */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaIcon}>🏪</div>
          <h2 className={styles.ctaTitle}>Own a Venue?</h2>
          <p className={styles.ctaText}>Get your venue live in minutes and reach more locals today.</p>
          <div className={styles.ctaFeatures}>
            <span>✓ 100% Free</span>
            <span>✓ Post in seconds</span>
            <span>✓ No commitment</span>
          </div>
          <Button
            onClick={() => router.push('/auth/signup?role=venue')}
            className={styles.ctaButton}
          >
            Get Started →
          </Button>
        </div>
      </section>

      {/* Active Offers Section */}
      <section className={styles.offersSection}>
        <div className={styles.sectionHeader}>
          <h2>ACTIVE OFFERS NEAR YOU</h2>
          <span className={styles.count}>{posts.length} live</span>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading specials...</div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>
            <p>No specials found. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => (
              <div
                key={post.id}
                className={styles.card}
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                {post.image_url && (
                  <div className={styles.cardImage}>
                    <img src={post.image_url} alt={post.title} />
                    <div className={styles.timer}>
                      <span className={styles.liveTag}>● LIVE</span>
                      <span>{timeRemaining(post.end_time)}</span>
                    </div>
                    {post.discount_amount && (
                      <div className={styles.discountTag}>
                        {post.discount_type === 'percentage'
                          ? `${post.discount_amount}% OFF`
                          : `$${post.discount_amount} OFF`}
                      </div>
                    )}
                  </div>
                )}
                <div className={styles.cardContent}>
                  <h3>{post.title}</h3>
                  <p className={styles.venue}>{post.venue_name || 'Venue'}</p>
                  <p className={styles.description}>{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sign In CTA */}
      <section className={styles.signInCta}>
        <h2>Start discovering specials near you</h2>
        <Button
          onClick={() => router.push('/auth/signin')}
          className={styles.signInButton}
        >
          Sign In
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push('/auth/signup')}
          className={styles.signUpButton}
        >
          Create Account
        </Button>
      </section>
    </div>
  );
}
