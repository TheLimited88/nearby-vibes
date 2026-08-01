'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-2xl font-bold text-accent-primary">Nearby Vibes</h1>
          <button className="p-2 hover:bg-background rounded-md transition">
            ☰
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-md mx-auto p-4 space-y-4">
          {/* Age Verification CTA */}
          <div className="bg-surface rounded-lg p-6 text-center space-y-4 shadow-card">
            <h2 className="text-xl font-bold">Welcome to Nearby Vibes</h2>
            <p className="text-text-secondary">
              Discover time-limited specials at nearby bars and restaurants
            </p>
            <div className="flex gap-3">
              <Link
                href="/auth/signin"
                className="flex-1 bg-accent-primary text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 border border-accent-primary text-accent-primary py-3 rounded-md font-semibold hover:bg-background transition"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Venue CTA */}
          <div className="bg-surface rounded-lg p-6 text-center space-y-4 shadow-card">
            <h3 className="text-lg font-bold">Are you a venue?</h3>
            <p className="text-text-secondary">
              Post time-limited specials and reach customers
            </p>
            <Link
              href="/venue/signup"
              className="block bg-accent-success text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
            >
              Become a Venue
            </Link>
          </div>

          {/* Legal Links */}
          <div className="flex gap-4 justify-center text-sm pt-4">
            <Link href="/terms" className="text-accent-primary hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-accent-primary hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
