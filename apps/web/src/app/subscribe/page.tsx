'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { subscriptionsAPI } from '@/lib/apiClient';
import { PlanCard } from '@/components/PlanCard';
import styles from './subscribe.module.css';

interface Subscription {
  plan: 'free' | 'premium' | 'pro';
  status: string;
  trial_ends_at?: string;
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      { name: 'Unlimited posts', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Single team member', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Team management', included: false },
      { name: 'Priority support', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49,
    period: 'month',
    description: 'For growing venues',
    features: [
      { name: 'Unlimited posts', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Single team member', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Team management', included: true },
      { name: 'Priority support', included: false },
    ],
    isPopular: true,
  },
];

export default function Subscribe() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
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
      setCurrentSubscription(response.data.subscription);
    } catch (err: any) {
      console.error('Failed to load subscription:', err);
      // If no subscription exists, that's fine - they're on free tier
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free' || planId === currentSubscription?.plan) {
      return;
    }

    try {
      setError('');
      const response = await subscriptionsAPI.createCheckout({
        plan: planId as 'premium' | 'pro',
      });

      // Redirect to Paddle checkout
      window.location.href = response.data.checkout_url;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create checkout');
    }
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan === planId || (planId === 'free' && !currentSubscription?.plan);
  };

  const trialEndsAt = currentSubscription?.trial_ends_at
    ? new Date(currentSubscription.trial_ends_at)
    : null;

  const daysLeft = trialEndsAt
    ? Math.ceil((trialEndsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : 0;

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
        <h1>Choose Your Plan</h1>
        <p>Upgrade to unlock advanced features and grow your venue</p>

        {currentSubscription?.status === 'trialing' && daysLeft > 0 && (
          <div className={styles.trialBanner}>
            <span>🎉 Your trial ends in {daysLeft} days</span>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading your subscription...</div>
      ) : (
        <>
          <div className={styles.grid}>
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                isPopular={plan.isPopular}
                isCurrentPlan={isCurrentPlan(plan.id)}
                buttonText={plan.price === 0 ? 'Stay on Free' : 'Upgrade Now'}
                onSelect={() => handleSelectPlan(plan.id)}
              />
            ))}
          </div>

          <div className={styles.features}>
            <h2>What's Included</h2>

            <div className={styles.comparisonGrid}>
              <div className={styles.feature}>
                <h3>Advanced Analytics</h3>
                <p>Track detailed metrics about your posts and customer engagement with premium dashboards.</p>
                <span className={styles.badge}>Premium</span>
              </div>

              <div className={styles.feature}>
                <h3>Team Management</h3>
                <p>Invite team members and assign roles (content creators, managers) to collaborate on posts.</p>
                <span className={styles.badge}>Premium</span>
              </div>

              <div className={styles.feature}>
                <h3>Priority Support</h3>
                <p>Get faster response times from our support team for urgent issues and questions.</p>
                <span className={styles.badge}>Coming Soon</span>
              </div>

              <div className={styles.feature}>
                <h3>Custom Branding</h3>
                <p>Customize your venue profile with your own brand colors and logos.</p>
                <span className={styles.badge}>Coming Soon</span>
              </div>
            </div>
          </div>

          <div className={styles.faq}>
            <h2>Frequently Asked Questions</h2>

            <div className={styles.faqItem}>
              <h4>Can I change plans anytime?</h4>
              <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>Is there a free trial?</h4>
              <p>Yes, new venues get a 14-day free trial of all features. No credit card required to get started.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, PayPal, and other payment methods through our payment partner Paddle.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>Do you offer discounts for annual billing?</h4>
              <p>Contact our sales team for information about annual billing and volume discounts.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
