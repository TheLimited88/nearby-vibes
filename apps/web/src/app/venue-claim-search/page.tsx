'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './venue-claim-search.module.css';

interface VenueResult {
  id: string;
  name: string;
  address: string;
  city: string;
  placeId: string;
  photo?: string;
  claimed: boolean;
}

export default function VenueClaimSearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<VenueResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueResult | null>(null);
  const [claimed, setClaimed] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    // TODO: API call to Google Places API via backend
    // Simulating results
    setTimeout(() => {
      setResults([
        {
          id: '1',
          name: 'The Local Bar & Grill',
          address: '123 Main St',
          city: 'Downtown',
          placeId: 'place_1',
          claimed: false,
        },
        {
          id: '2',
          name: 'The Local Bar & Grill - Uptown',
          address: '456 Elm Ave',
          city: 'Uptown',
          placeId: 'place_2',
          claimed: false,
        },
        {
          id: '3',
          name: 'Local Sports Bar',
          address: '789 Oak Rd',
          city: 'Westside',
          placeId: 'place_3',
          claimed: true,
        },
      ]);
      setSearching(false);
    }, 800);
  };

  const handleClaim = async () => {
    if (!selectedVenue) return;
    // TODO: API call to claim venue
    setClaimed(true);
    setTimeout(() => {
      router.push('/venue-home');
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
        <h1 className={styles.title}>Claim Your Venue</h1>
      </header>

      <main className={styles.content}>
        {!claimed ? (
          <>
            {/* Search Form */}
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchInput}>
                <input
                  type="text"
                  placeholder="Search for your venue by name or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className={styles.searchBtn} disabled={searching}>
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>
              <p className={styles.hint}>We use Google Places to find your venue</p>
            </form>

            {/* Results */}
            {results.length > 0 && (
              <div className={styles.results}>
                <h2 className={styles.resultsTitle}>Results for "{searchQuery}"</h2>
                <div className={styles.resultsList}>
                  {results.map((venue) => (
                    <div
                      key={venue.id}
                      className={`${styles.resultCard} ${selectedVenue?.id === venue.id ? styles.selected : ''} ${venue.claimed ? styles.claimed : ''}`}
                      onClick={() => !venue.claimed && setSelectedVenue(venue)}
                    >
                      {venue.photo && (
                        <div className={styles.venuePhoto}>
                          <img src={venue.photo} alt={venue.name} />
                        </div>
                      )}
                      <div className={styles.venueInfo}>
                        <h3 className={styles.venueName}>{venue.name}</h3>
                        <p className={styles.venueAddress}>
                          {venue.address}
                          {venue.city && <>, {venue.city}</>}
                        </p>
                        {venue.claimed && (
                          <div className={styles.claimedBadge}>Already claimed by another owner</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Panel */}
            {selectedVenue && !selectedVenue.claimed && (
              <div className={styles.detailsPanel}>
                <h3>Is this your venue?</h3>
                <div className={styles.selectedInfo}>
                  <p className={styles.label}>Venue Name</p>
                  <p className={styles.value}>{selectedVenue.name}</p>
                </div>
                <div className={styles.selectedInfo}>
                  <p className={styles.label}>Address</p>
                  <p className={styles.value}>
                    {selectedVenue.address}
                    {selectedVenue.city && <>, {selectedVenue.city}</>}
                  </p>
                </div>
                <button className={styles.claimBtn} onClick={handleClaim}>
                  Yes, Claim This Venue
                </button>
                <button className={styles.cancelBtn} onClick={() => setSelectedVenue(null)}>
                  No, Keep Searching
                </button>
              </div>
            )}

            {/* Empty State */}
            {searchQuery && results.length === 0 && !searching && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>No venues found</h3>
                <p>Try searching with a different name or address</p>
              </div>
            )}
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h2>Venue Claimed Successfully!</h2>
            <p>We're setting up your venue dashboard...</p>
            <p className={styles.redirect}>Redirecting to your venue home in a moment</p>
          </div>
        )}
      </main>
    </div>
  );
}
