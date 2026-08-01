'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './checkout.module.css';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Browse and discover local specials',
      features: ['Browse active specials', 'Follow venues', 'Receive notifications', 'Save favorites'],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 4.99,
      period: 'month',
      description: 'Unlock premium features',
      features: [
        'All Free features',
        'Priority notifications',
        'Early access to new venues',
        'Custom filters',
        'Save up to 100 favorites',
      ],
      popular: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      period: 'month',
      description: 'For serious special hunters',
      features: [
        'All Premium features',
        'Unlimited saved favorites',
        'Advanced analytics',
        'Venue recommendations',
        'Priority support',
      ],
    },
  ];

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      // TODO: API call to validate and apply promo code
      setAppliedPromo({
        code: promoCode,
        discount: Math.random() * 50, // Placeholder
      });
      setPromoCode('');
    }
  };

  const handleCheckout = () => {
    if (!selectedPlan) return;
    // TODO: Redirect to Paddle checkout
    console.log('Checkout:', { plan: selectedPlan, promo: appliedPromo });
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    const plan = plans.find((p) => p.id === selectedPlan);
    if (!plan) return 0;
    const discount = appliedPromo ? plan.price * (appliedPromo.discount / 100) : 0;
    return plan.price - discount;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
        <h1 className={styles.title}>Choose Your Plan</h1>
      </header>

      <main className={styles.content}>
        {/* Plans Grid */}
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.planCard} ${selectedPlan === plan.id ? styles.selected : ''} ${plan.popular ? styles.popular : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.priceSection}>
                {plan.price > 0 ? (
                  <>
                    <span className={styles.price}>${plan.price.toFixed(2)}</span>
                    <span className={styles.period}>/ {plan.period}</span>
                  </>
                ) : (
                  <span className={styles.price}>Free</span>
                )}
              </div>
              <p className={styles.description}>{plan.description}</p>
              <ul className={styles.featuresList}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Promo Code Section */}
        {selectedPlan && selectedPlan !== 'free' && (
          <section className={styles.promoSection}>
            <h3>Have a promo code?</h3>
            <div className={styles.promoInput}>
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyPromoCode()}
              />
              <button onClick={applyPromoCode} className={styles.applyBtn}>
                Apply
              </button>
            </div>
            {appliedPromo && (
              <div className={styles.promoApplied}>
                ✓ Code "{appliedPromo.code}" applied - {appliedPromo.discount.toFixed(0)}% off!
              </div>
            )}
          </section>
        )}

        {/* Summary */}
        {selectedPlan && (
          <section className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Plan</span>
              <span className={styles.summaryValue}>
                {plans.find((p) => p.id === selectedPlan)?.name}
              </span>
            </div>
            {selectedPlan !== 'free' && (
              <>
                <div className={styles.summaryRow}>
                  <span>Monthly Price</span>
                  <span className={styles.summaryValue}>
                    ${plans.find((p) => p.id === selectedPlan)?.price.toFixed(2)}
                  </span>
                </div>
                {appliedPromo && (
                  <div className={styles.summaryRow}>
                    <span>Discount ({appliedPromo.code})</span>
                    <span className={styles.discount}>
                      -${((plans.find((p) => p.id === selectedPlan)?.price || 0) * (appliedPromo.discount / 100)).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Total</span>
                  <span className={styles.totalAmount}>${calculateTotal().toFixed(2)}/mo</span>
                </div>
              </>
            )}
          </section>
        )}

        {/* CTA Buttons */}
        <div className={styles.actions}>
          {selectedPlan === 'free' ? (
            <button
              className={styles.ctaBtn}
              onClick={() => {
                // TODO: Create free account
                router.push('/home');
              }}
            >
              Get Started for Free
            </button>
          ) : (
            <button
              className={styles.ctaBtn}
              disabled={!selectedPlan || selectedPlan === 'free'}
              onClick={handleCheckout}
            >
              Continue to Payment
            </button>
          )}
          <p className={styles.legal}>
            By continuing, you agree to our{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
