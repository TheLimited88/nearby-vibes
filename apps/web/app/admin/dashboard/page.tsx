'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalVenues: 342,
    totalUsers: 5234,
    activeSubscriptions: 89,
    pendingReports: 12,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button className="p-2 hover:bg-background rounded-md">⚙️</button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-md mx-auto p-4 space-y-6 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface p-4 rounded-lg shadow-card text-center">
            <p className="text-2xl font-bold">{stats.totalVenues}</p>
            <p className="text-xs text-text-secondary">Venues</p>
          </div>
          <div className="bg-surface p-4 rounded-lg shadow-card text-center">
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-text-secondary">Users</p>
          </div>
          <div className="bg-surface p-4 rounded-lg shadow-card text-center">
            <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
            <p className="text-xs text-text-secondary">Subscriptions</p>
          </div>
          <div className="bg-surface p-4 rounded-lg shadow-card text-center ring-2 ring-red-500">
            <p className="text-2xl font-bold text-red-500">{stats.pendingReports}</p>
            <p className="text-xs text-text-secondary">Reports</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Link
            href="/admin/reports"
            className="flex items-center justify-between bg-surface p-4 rounded-lg shadow-card hover:shadow-modal transition"
          >
            <span className="font-semibold">Report Queue</span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {stats.pendingReports}
            </span>
          </Link>

          <Link
            href="/admin/onboarding-queue"
            className="flex items-center justify-between bg-surface p-4 rounded-lg shadow-card hover:shadow-modal transition"
          >
            <span className="font-semibold">Onboarding Queue</span>
            <span>→</span>
          </Link>

          <Link
            href="/admin/venues"
            className="flex items-center justify-between bg-surface p-4 rounded-lg shadow-card hover:shadow-modal transition"
          >
            <span className="font-semibold">Manage Venues</span>
            <span>→</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center justify-between bg-surface p-4 rounded-lg shadow-card hover:shadow-modal transition"
          >
            <span className="font-semibold">Manage Users</span>
            <span>→</span>
          </Link>

          <Link
            href="/admin/network-dashboard"
            className="flex items-center justify-between bg-surface p-4 rounded-lg shadow-card hover:shadow-modal transition"
          >
            <span className="font-semibold">Network Dashboard</span>
            <span>→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
