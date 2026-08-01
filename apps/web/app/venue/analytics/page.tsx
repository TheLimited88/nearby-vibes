'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/venue/dashboard" className="text-accent-primary font-semibold">
            ←
          </Link>
          <h1 className="text-lg font-bold">Analytics</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Period Selector */}
      <div className="bg-surface border-b border-border-default p-3 flex gap-2">
        {(['day', 'week', 'month'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-md font-semibold text-sm transition ${
              period === p
                ? 'bg-accent-primary text-white'
                : 'bg-background text-text-secondary hover:bg-background'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="max-w-md mx-auto p-4 space-y-6 pb-20">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface p-4 rounded-lg shadow-card">
            <p className="text-xs text-text-secondary mb-1">Impressions</p>
            <p className="text-2xl font-bold">2,341</p>
            <p className="text-xs text-accent-success mt-2">+12% vs last period</p>
          </div>
          <div className="bg-surface p-4 rounded-lg shadow-card">
            <p className="text-xs text-text-secondary mb-1">Engagement</p>
            <p className="text-2xl font-bold">8.2%</p>
            <p className="text-xs text-accent-success mt-2">+2% vs last period</p>
          </div>
          <div className="bg-surface p-4 rounded-lg shadow-card">
            <p className="text-xs text-text-secondary mb-1">Clicks</p>
            <p className="text-2xl font-bold">192</p>
            <p className="text-xs text-accent-success mt-2">+5% vs last period</p>
          </div>
          <div className="bg-surface p-4 rounded-lg shadow-card">
            <p className="text-xs text-text-secondary mb-1">Followers</p>
            <p className="text-2xl font-bold">456</p>
            <p className="text-xs text-accent-success mt-2">+23 new</p>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-surface p-4 rounded-lg shadow-card">
          <h3 className="font-bold mb-4">Push Sent vs Opens</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Sent</span>
              <span className="font-semibold">1,234</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-accent-primary" style={{ width: '100%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-text-secondary">Opened</span>
              <span className="font-semibold">342</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-accent-success" style={{ width: '28%' }}></div>
            </div>
          </div>
        </div>

        {/* Top Posts */}
        <div>
          <h3 className="font-bold mb-3">Top Performing Posts</h3>
          <div className="space-y-2">
            {['Happy Hour Special', 'Weekend Brunch', 'Late Night Deal'].map((title, i) => (
              <div key={i} className="bg-surface p-3 rounded-lg flex justify-between">
                <span className="text-sm font-semibold">{title}</span>
                <span className="text-text-secondary text-sm">{(i + 1) * 400} views</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
