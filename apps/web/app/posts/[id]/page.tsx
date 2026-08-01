'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // TODO: Fetch post from API
    setPost({
      id: postId,
      title: 'Happy Hour Special',
      venueName: 'The Local Bar',
      description: '50% off all appetizers',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      heroImageUrl: '/placeholder.png',
    });
  }, [postId]);

  useEffect(() => {
    if (!post) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(post.endTime).getTime();
      const remaining = Math.max(0, Math.floor((endTime - now) / 60000));
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [post]);

  if (!post) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/home" className="text-accent-primary font-semibold">
            ←
          </Link>
          <h1 className="text-lg font-bold">Post</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {/* Hero Image */}
        <div className="relative aspect-square bg-background">
          <img
            src={post.heroImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Timer Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white text-sm font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-accent-success rounded-full"></span>
              LIVE
            </span>
            <span>{timeRemaining} min left</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
            <div
              className="h-full bg-accent-success transition-all"
              style={{ width: `${Math.min(100, (timeRemaining / 120) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <Link href={`/venues/${post.venueId}`} className="text-accent-primary font-semibold">
              {post.venueName}
            </Link>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Details</h3>
            <p className="text-text-secondary">{post.description}</p>
          </div>

          <div className="bg-background p-4 rounded-md">
            <p className="text-sm text-text-tertiary">Active until</p>
            <p className="font-semibold">{post.endTime.toLocaleTimeString()}</p>
            <p className="text-sm text-accent-bright mt-2">{timeRemaining} min left</p>
          </div>

          <button className="w-full btn-cta py-3">Save Post</button>
        </div>
      </main>
    </div>
  );
}
