'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { subscriptionsAPI } from '@/lib/apiClient';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import styles from './subscription.module.css';

interface Subscription {
  id: string;
  plan: 'free' | 'premium' | 'pro';
  status: 'trialing' | 'active' | 'past_due' | 'cancelled';
  trial_ends_at?: string;
  next_billing_date?: string;
  amount?: number;
  founding_venue: boolean;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'venue') {
      router.push('/auth/signin?role=venue');
      return;
    }

    loadSubscription();
  }, [isAuthenticated, user, router]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const response = await subscriptionsAPI.getCurrentSubscription();
      setSubscription(response.data.subscription);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'trialing':
        return styles.statusTrial;
      case 'past_due':
        return styles.statusPastDue;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const daysRemaining = subscription?.trial_ends_at
    ? Math.ceil(
        (new Date(subscription.trial_ends_at).getTime() - Date.now()) /
          (24 * 60 * 60 * 1000)
      )
    : 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading subscription...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Subscription & Billing</h1>
        <p>Manage your venue subscription and billing information</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {subscription ? (
        <>
          <Card className={styles.statusCard}>
            <div className={styles.statusContent}>
              <div className={styles.statusInfo}>
                <h3>Current Plan</h3>
                <div className={styles.planName}>
                  {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                  {subscription.founding_venue && (
                    <span className={styles.foundingBadge}>Founding Venue</span>
                  )}
                </div>
                <span className={`${styles.status} ${getStatusColor(subscription.status)}`}>
                  {subscription.status === 'trialing'
                    ? `Trial - ${daysRemaining} days left`
                    : subscription.status.toUpperCase()}
                </span>
              </div>

              <div className={styles.actions}>
                {subscription.status === 'trialing' && (
                  <Button onClick={() => router.push('/subscribe')}>
                    Upgrade to Premium
                  </Button>
                )}
                {subscription.status === 'active' && subscription.plan !== 'pro' && (
                  <Button onClick={() => router.push('/subscribe')}>
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {subscription.status === 'trialing' && (
            <Card className={styles.trialCard}>
              <div className={styles.trialIcon}>🎉</div>
              <h3>Your Free Trial</h3>
              <p>
                You're on a 14-day free trial of all features. After that, choose a plan to
                continue using Nearby Vibes.
              </p>
              <div className={styles.trialDates}>
                <div className={styles.trialDate}>
                  <span className={styles.label}>Trial Ends</span>
                  <span className={styles.value}>{formatDate(subscription.trial_ends_at || '')}</span>
                </div>
                <div className={styles.trialDate}>
                  <span className={styles.label}>Days Remaining</span>
                  <span className={styles.value}>{daysRemaining} days</span>
                </div>
              </div>
              <Button fullWidth onClick={() => router.push('/subscribe')}>
                Choose Your Plan
              </Button>
            </Card>
          )}

          {subscription.status === 'active' && (
            <Card className={styles.billingCard}>
              <h3>Next Billing</h3>
              <div className={styles.billingInfo}>
                <div className={styles.billingItem}>
                  <span className={styles.label}>Next Billing Date</span>
                  <span className={styles.value}>
                    {subscription.next_billing_date
                      ? formatDate(subscription.next_billing_date)
                      : 'N/A'}
                  </span>
                </div>
                <div className={styles.billingItem}>
                  <span className={styles.label}>Amount</span>
                  <span className={styles.value}>
                    ${subscription.amount?.toFixed(2) || '0.00'}/month
                  </span>
                </div>
              </div>
            </Card>
          )}

          <Card className={styles.section}>
            <h3>Features</h3>
            <div className={styles.featuresList}>
              {subscription.plan === 'free' ? (
                <>
                  <div className={styles.featureItem}>
                    <span className={styles.icon}>✓</span>
                    <span>Unlimited posts</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.icon}>✓</span>
                    <span>Basic analytics</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.icon}>✓</span>
                    <span>Single team member</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.icon}>✕</span>
                    <span className={styles.disabled}>Advanced analytics</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.icon}>✕</span>
                    <span className={styles.disabled}>Team management</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.featureItem}>
                    <span className={styles.icon}>✓</span>
                    <span>Unlimited posts</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.icon}>✓</span>
                    <span>Basic analytics</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.icon}>✓</span>
                    <span>Advanced analytics</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.icon}>✓</span>
                    <span>Team management</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.icon}>✓</span>
                    <span>Up to 5 team members</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card className={styles.section}>
            <h3>Need Help?</h3>
            <p>Have questions about your subscription? Here are some quick links:</p>
            <div className={styles.helpLinks}>
              <Button variant="secondary" onClick={() => router.push('/subscribe')}>
                View All Plans
              </Button>
              <Button variant="secondary">Contact Support</Button>
              <Button variant="secondary">Download Invoice</Button>
            </div>
          </Card>
        </>
      ) : (
        <div className={styles.empty}>
          <p>No subscription found. Start your free trial today!</p>
          <Button onClick={() => router.push('/subscribe')}>Get Started</Button>
        </div>
      )}
    </div>
  );
}
