'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'tile' | 'map'>('tile');

  useEffect(() => {
    // TODO: Fetch posts from API
    setPosts([]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-accent-primary">Nearby Vibes</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'tile' ? 'map' : 'tile')}
              className="p-2 hover:bg-background rounded-md transition"
              title={`Switch to ${viewMode === 'tile' ? 'map' : 'tile'} view`}
            >
              {viewMode === 'tile' ? '🗺️' : '⊞'}
            </button>
            <button className="p-2 hover:bg-background rounded-md transition">
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {viewMode === 'tile' ? (
          <div className="grid grid-cols-2 gap-3 p-3">
            {posts.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-text-secondary">No specials nearby</p>
                <p className="text-sm text-text-tertiary">Check back soon</p>
              </div>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="bg-surface rounded-lg overflow-hidden shadow-card hover:shadow-modal transition"
                >
                  <div className="aspect-square bg-background relative">
                    {/* Hero image placeholder */}
                    <img
                      src={post.heroImageUrl || '/placeholder.png'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Timer bar overlay */}
                    <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center text-white text-xs font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-accent-success rounded-full"></span>
                        LIVE
                      </span>
                      <span>{post.timeRemaining} min left</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-accent-success"
                        style={{ width: `${post.timeRemaining}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">
                      {post.title}
                    </h3>
                    <p className="text-xs text-text-tertiary truncate">
                      {post.venueName}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-text-secondary">Map view coming soon</p>
          </div>
        )}
      </main>
    </div>
  );
}
