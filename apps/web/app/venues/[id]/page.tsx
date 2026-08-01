'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function VenueProfilePage() {
  const params = useParams();
  const venueId = params.id as string;
  const [venue, setVenue] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch venue from API
    setVenue({
      id: venueId,
      name: 'The Local Bar',
      address: '123 Main St, New York, NY',
      description: 'The best specials in town',
      heroImageUrl: '/placeholder.png',
    });
    setPosts([
      {
        id: '1',
        title: 'Happy Hour',
        description: '50% off all drinks',
        timeRemaining: 45,
      },
      {
        id: '2',
        title: 'Food Special',
        description: 'Free appetizer with drink',
        timeRemaining: 30,
      },
    ]);
  }, [venueId]);

  if (!venue) {
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
          <h1 className="text-lg font-bold">Venue</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Hero */}
      <div className="aspect-video bg-background">
        <img
          src={venue.heroImageUrl}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{venue.name}</h1>
          <p className="text-text-secondary text-sm">{venue.address}</p>
          <p className="text-text-secondary mt-2">{venue.description}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-3 rounded-md font-semibold transition ${
              isFollowing
                ? 'bg-background border border-accent-primary text-accent-primary'
                : 'btn-cta text-white'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button className="flex-1 btn-cta text-white py-3">
            📍 View on Map
          </button>
        </div>

        {/* Posts */}
        <div>
          <h2 className="text-lg font-bold mb-3">Active Specials</h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="bg-surface p-4 rounded-lg shadow-card hover:shadow-modal transition block"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-text-secondary text-sm">{post.description}</p>
                  </div>
                  <span className="text-accent-bright font-semibold text-sm">
                    {post.timeRemaining}m
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
