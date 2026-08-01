'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
  const [step, setStep] = useState<'plan' | 'payment'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handlePlanSelect = (plan: 'free' | 'premium') => {
    setSelectedPlan(plan);
    if (plan === 'premium') {
      setStep('payment');
    } else {
      // Complete subscription for free plan
      setStep('plan');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/venue/dashboard" className="text-accent-primary font-semibold">
            ←
          </Link>
          <h1 className="text-lg font-bold">Subscription</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-md mx-auto p-4 space-y-6 pb-20">
        {step === 'plan' ? (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
              <p className="text-text-secondary">Start with a 14-day free trial</p>
            </div>

            {/* Plans */}
            <div className="space-y-3">
              {/* Free Plan */}
              <div
                onClick={() => handlePlanSelect('free')}
                className={`bg-surface p-6 rounded-lg border-2 cursor-pointer transition ${
                  selectedPlan === 'free'
                    ? 'border-accent-primary'
                    : 'border-border-default hover:border-border-light'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">Free</h3>
                  <span className="text-2xl font-bold">$0</span>
                </div>
                <p className="text-text-secondary text-sm mb-4">Forever free</p>
                <ul className="text-sm space-y-2">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Post basic specials</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Basic analytics</span>
                  </li>
                </ul>
              </div>

              {/* Premium Plan */}
              <div
                onClick={() => handlePlanSelect('premium')}
                className={`bg-surface p-6 rounded-lg border-2 cursor-pointer transition ring-2 ring-offset-2 ring-accent-primary/50 ${
                  selectedPlan === 'premium'
                    ? 'border-accent-primary'
                    : 'border-border-default hover:border-border-light'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold">Premium</h3>
                    <span className="text-xs bg-accent-primary text-white px-2 py-1 rounded mt-1 inline-block">
                      14-day free trial
                    </span>
                  </div>
                  <span className="text-2xl font-bold">$29<span className="text-sm">/mo</span></span>
                </div>
                <p className="text-text-secondary text-sm mb-4">Best for growing venues</p>
                <ul className="text-sm space-y-2">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Premium specials (exclusive to paid subscribers)</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Team member seats</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => selectedPlan === 'premium' && setStep('payment')}
              disabled={selectedPlan !== 'premium'}
              className="w-full btn-cta text-white py-3 disabled:opacity-50"
            >
              {selectedPlan === 'premium' ? 'Continue to Payment' : 'Start Free Plan'}
            </button>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
              <p className="text-text-secondary">14-day free trial, then $29/month</p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={(e) =>
                    setCardData({ ...cardData, cardNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) =>
                      setCardData({ ...cardData, expiry: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardData.cvc}
                    onChange={(e) =>
                      setCardData({ ...cardData, cvc: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-cta text-white py-3"
              >
                Start Free Trial
              </button>
              <button
                type="button"
                onClick={() => setStep('plan')}
                className="w-full border border-border-default py-3 rounded-md font-semibold hover:bg-background transition"
              >
                Back
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
