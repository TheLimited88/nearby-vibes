'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function VenueDashboardPage() {
  const [stats, setStats] = useState({
    activePosts: 2,
    totalFollowers: 150,
    impressions: 1200,
    engagement: 45,
  });

  const [posts, setPosts] = useState<any[]>([
    {
      id: '1',
      title: 'Happy Hour Special',
      status: 'live',
      startTime: '5:00 PM',
      endTime: '8:00 PM',
      views: 234,
    },
    {
      id: '2',
      title: 'Food Promo',
      status: 'scheduled',
      startTime: '8:00 PM',
      endTime: '11:00 PM',
      views: 0,
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Venue Dashboard</h1>
          <button className="p-2 hover:bg-background rounded-md">☰</button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-md mx-auto p-4 space-y-6 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface p-4 rounded-lg shadow-card text-center">
            <p className="text-3xl font-bold text-accent-primary">{stats.activePosts}</p>
            <p className="text-xs text-text-secondary">Active Posts</p>
          </div>
          <div className="bg-surface p-4 rounded-lg shadow-card text-center">
            <p className="text-3xl font-bold text-accent-success">{stats.totalFollowers}</p>
            <p className="text-xs text-text-secondary">Followers</p>
          </div>
          <div className="bg-surface p-4 rounded-lg shadow-card text-center">
            <p className="text-3xl font-bold text-accent-primary">{stats.impressions}</p>
            <p className="text-xs text-text-secondary">Impressions</p>
          </div>
          <div className="bg-surface p-4 rounded-lg shadow-card text-center">
            <p className="text-3xl font-bold text-accent-primary">{stats.engagement}%</p>
            <p className="text-xs text-text-secondary">Engagement</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/venue/create-post"
            className="flex-1 btn-cta text-white py-3 text-center font-semibold"
          >
            + Create Post
          </Link>
          <Link
            href="/venue/analytics"
            className="flex-1 border border-accent-primary text-accent-primary py-3 rounded-md font-semibold text-center hover:bg-background transition"
          >
            Analytics
          </Link>
        </div>

        {/* Posts List */}
        <div>
          <h2 className="font-bold mb-3">Your Posts</h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/venue/posts/${post.id}`}
                className="bg-surface p-4 rounded-lg shadow-card hover:shadow-modal transition block"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold flex-1">{post.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    post.status === 'live'
                      ? 'bg-accent-success/20 text-accent-success'
                      : 'bg-background text-text-secondary'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-text-secondary text-sm">
                  {post.startTime} - {post.endTime}
                </p>
                <p className="text-xs text-text-tertiary mt-2">
                  {post.views} views
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
