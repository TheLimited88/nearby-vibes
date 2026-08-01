'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [ageGate, setAgeGate] = useState<'pending' | 'verified' | 'declined'>('pending');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [venueCtaSlide, setVenueCtaSlide] = useState(0);
  const [specialFilter, setSpecialFilter] = useState('all');
  const [unit, setUnit] = useState('mi');
  const [authState, setAuthState] = useState<'signedOut' | 'customer' | 'venue'>('signedOut');

  useEffect(() => {
    const saved = localStorage.getItem('nv_age_gate');
    if (saved === 'verified') {
      setAgeGate('verified');
    } else if (saved === 'declined') {
      setAgeGate('declined');
    } else {
      setAgeGate('pending');
      setShowAgeModal(true);
    }
  }, []);

  const verifyAge = () => {
    localStorage.setItem('nv_age_gate', 'verified');
    setAgeGate('verified');
    setShowAgeModal(false);
    setShowDecline(false);
  };

  const declineAge = () => {
    setShowAgeModal(false);
    setShowDecline(true);
  };

  const tryAgeAgain = () => {
    setShowDecline(false);
    setShowAgeModal(true);
  };

  const continueBrowsing = () => {
    localStorage.setItem('nv_age_gate', 'declined');
    setAgeGate('declined');
    setShowDecline(false);
  };

  const distHeader = unit === 'mi' ? '<0.75mi' : '<1.2km';
  const isVenue = authState === 'venue';
  const isNotVenue = authState !== 'venue';
  const isCustomer = authState === 'customer';
  const isSignedOut = authState === 'signedOut';
  const ageVerified = ageGate === 'verified';

  const showTile1 = (specialFilter === 'all' || specialFilter === 'drink') && (isSignedOut || isCustomer || ageVerified);
  const showTile1Locked = (specialFilter === 'all' || specialFilter === 'drink') && !ageVerified;
  const showTile2 = specialFilter === 'all' || specialFilter === 'food';
  const showTile3 = (specialFilter === 'all' || specialFilter === 'drink') && (isSignedOut || isCustomer || ageVerified);
  const showTile3Locked = (specialFilter === 'all' || specialFilter === 'drink') && !ageVerified;

  return (
    <div className={styles.container}>
      {/* Age Verification Modal */}
      {showAgeModal && (
        <div className={styles.ageModalOverlay}>
          <div className={styles.ageModal}>
            <div className={styles.ageModalIcon}>🔒</div>
            <div className={styles.ageModalTitle}>Age Verification</div>
            <div className={styles.ageModalDesc}>
              Some posts on Nearby Vibes feature drink specials from bars and venues. You must be 21 or older in the US (18+ in other regions) to view this content.
            </div>
            <div className={styles.ageModalButtons}>
              <button className={styles.ageModalPrimary} onClick={verifyAge}>
                I'm 21+ (US) / 18+ (Elsewhere)
              </button>
              <button className={styles.ageModalSecondary} onClick={declineAge}>
                I'm not old enough
              </button>
            </div>
            <div className={styles.ageModalFooter}>
              By continuing, you confirm the age information provided is accurate, and agree to our <a href="#tos">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
            </div>
          </div>
        </div>
      )}

      {/* Age Restricted Screen */}
      {showDecline && (
        <div className={styles.ageRestrictedContainer}>
          <div className={styles.logoHeader}>
            <img src="/nv-icon.png" alt="NV" style={{ height: 26 }} />
            <span>Nearby Vibes</span>
          </div>
          <div className={styles.ageRestrictedIcon}>🔐</div>
          <div className={styles.ageRestrictedTitle}>Age Restricted</div>
          <div className={styles.ageRestrictedDesc}>
            You must meet the minimum drinking age to view drink specials on Nearby Vibes. You're welcome to keep browsing food specials.
          </div>
          <div className={styles.ageRestrictedButtons}>
            <button className={styles.tryAgainBtn} onClick={tryAgeAgain}>
              Try Again
            </button>
            <button className={styles.continueBrowsingBtn} onClick={continueBrowsing}>
              Continue Browsing (Food Specials)
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!showDecline && (
        <div className={styles.mainContent}>
          {/* Hero Section */}
          <div className={styles.hero}>
            <div className={styles.heroImage}>🖼️ Hero — venue crowd / nightlife</div>
            <div className={styles.heroGradient} />

            {/* Header */}
            <header className={styles.header}>
              <div className={styles.logo}>
                <img src="/nv-icon.png" alt="NV" style={{ height: 32 }} />
                <span>Nearby Vibes</span>
              </div>
              <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
                ☰
              </button>
            </header>

            {/* Menu Sidebar */}
            {menuOpen && (
              <>
                <div className={styles.menuOverlay} onClick={() => setMenuOpen(false)} />
                <div className={styles.sidebar}>
                  <div className={styles.profileBtn} onClick={() => { setProfileOpen(!profileOpen); setMenuOpen(false); }}>
                    <div className={styles.profileIcon}>👤</div>
                    <div>
                      {isSignedOut && (
                        <>
                          <div className={styles.profileName}>Sign in / Create account</div>
                          <div className={styles.profileEmail}>Customer or Venue</div>
                        </>
                      )}
                      {isCustomer && (
                        <>
                          <div className={styles.profileName}>My Account</div>
                          <div className={styles.profileEmail}>Signed in as Customer</div>
                        </>
                      )}
                      {isVenue && (
                        <>
                          <div className={styles.profileName}>Venue Account</div>
                          <div className={styles.profileEmail}>Signed in as Venue</div>
                        </>
                      )}
                    </div>
                  </div>
                  {isVenue && (
                    <a href="/venue/posts/create" className={styles.createPostBtn}>
                      <span>➕</span> Create Post
                    </a>
                  )}
                  <div className={styles.menuDivider} />
                  <a href="#home" className={styles.menuItem}>Home</a>
                  <a href="/become-venue" className={styles.menuItemVenue}>Become a Venue</a>
                  <a href="#about" className={styles.menuItem}>About</a>
                  <a href="#faq" className={styles.menuItem}>FAQ</a>
                  <a href="#contact" className={styles.menuItem}>Contact</a>
                  <div className={styles.menuDivider} />
                  <a href="#tos" className={styles.menuItemSmall}>Terms of Service</a>
                  <a href="#privacy" className={styles.menuItemSmall}>Privacy Policy</a>
                  <a href="#aup" className={styles.menuItemSmall}>Acceptable Use Policy</a>
                  <div className={styles.menuDivider} />
                  <button onClick={() => setSettingsOpen(true)} className={styles.settingsBtn}>
                    ⚙️ Settings
                  </button>
                </div>
              </>
            )}

            {/* FAB for Venue Users */}
            {isVenue && (
              <a href="/venue/posts/create" className={styles.fab}>
                ➕
              </a>
            )}

            {/* Hero Text */}
            <div className={styles.heroText}>
              <h1>Live Specials</h1>
              <h2>Near You</h2>
            </div>
          </div>

          {/* Venue CTA Card */}
          {true && (
            <div className={styles.ctaCard}>
              <button className={styles.closeCtaBtn} onClick={() => {}}>✕</button>

              {venueCtaSlide === 0 && (
                <div className={styles.ctaSlide}>
                  <div className={styles.ctaIcon}>🛡️</div>
                  <div className={styles.ctaHeading}>Own a Venue?</div>
                  <div className={styles.ctaDesc}>Get your venue live in minutes and reach more locals today.</div>
                  <a href="/become-venue" className={styles.ctaButton}>
                    Get Started →
                  </a>
                  <div className={styles.ctaBullets}>
                    <span>✓ 100% Free</span>
                    <span>✓ Post in seconds</span>
                    <span>✓ No commitment</span>
                  </div>
                </div>
              )}

              {venueCtaSlide === 1 && (
                <div className={styles.ctaSlide}>
                  <div className={styles.ctaIconSlide1}>🔔</div>
                  <div className={styles.ctaHeading}>Add Nearby Vibes to Your Home Screen</div>
                  <div className={styles.ctaDesc}>Never miss a deal — get instant alerts when specials drop near you.</div>
                  <button className={styles.ctaButtonSlide1} onClick={() => {}}>
                    Let's Go →
                  </button>
                  <div className={styles.ctaBullets}>
                    <span>✓ Works like an app</span>
                    <span>✓ Instant access</span>
                    <span>✓ Never miss a special</span>
                  </div>
                </div>
              )}

              <div className={styles.ctaIndicators}>
                <div
                  className={`${styles.indicator} ${venueCtaSlide === 0 ? styles.active : ''}`}
                  onClick={() => setVenueCtaSlide(0)}
                />
                <div
                  className={`${styles.indicator} ${venueCtaSlide === 1 ? styles.active : ''}`}
                  onClick={() => setVenueCtaSlide(1)}
                />
              </div>
            </div>
          )}

          {/* Offers Header */}
          <div className={styles.offersHeader}>
            <div className={styles.offersTitle}>ACTIVE OFFERS NEAR YOU</div>
            <div className={styles.distanceBadge}>{distHeader}</div>
            <div className={styles.liveBadge}>6 live</div>
          </div>

          {/* Filter Buttons */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${specialFilter === 'all' ? styles.active : ''}`}
              onClick={() => setSpecialFilter('all')}
            >
              All
            </button>
            <button
              className={`${styles.filterBtn} ${specialFilter === 'drink' ? styles.active : ''}`}
              onClick={() => setSpecialFilter('drink')}
            >
              Drinks
            </button>
            <button
              className={`${styles.filterBtn} ${specialFilter === 'food' ? styles.active : ''}`}
              onClick={() => setSpecialFilter('food')}
            >
              Food
            </button>
          </div>

          {/* Offer Cards */}
          <div className={styles.offersList}>
            {showTile1 && (
              <div className={styles.offerCard}>
                <div className={styles.cardImage}>
                  <div className={styles.imagePlaceholder}>Post photo</div>
                  <div className={styles.distanceTag}>0.3 mi</div>
                  <div className={`${styles.categoryBadge} ${styles.drink}`}>DRINK</div>
                  <div className={styles.liveIndicator}>
                    <span className={styles.liveDot}>●</span>
                    <span>LIVE</span>
                    <span className={styles.timer}>2:30</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progress} style={{ width: '68%' }} />
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.venueName}>Aye Aye</div>
                  <div className={styles.specialTitle}>2 for 1 Margaritas</div>
                  <div className={styles.address}>118 5th Ave</div>
                </div>
              </div>
            )}

            {showTile1Locked && (
              <div className={styles.offerCard} onClick={() => setShowAgeModal(true)}>
                <div className={styles.cardImage} style={{ cursor: 'pointer' }}>
                  <div className={styles.imagePlaceholder}>Post photo</div>
                  <div className={styles.lockedOverlay}>🔒 21+ to view</div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.venueName}>Aye Aye</div>
                  <div className={styles.specialTitle}>2 for 1 Margaritas</div>
                  <div className={styles.address}>118 5th Ave</div>
                </div>
              </div>
            )}

            {showTile2 && (
              <div className={styles.offerCard}>
                <div className={styles.cardImage}>
                  <div className={styles.imagePlaceholder}>Post photo</div>
                  <div className={styles.distanceTag}>0.6 mi</div>
                  <div className={`${styles.categoryBadge} ${styles.food}`}>FOOD</div>
                  <div className={styles.liveIndicator}>
                    <span className={styles.liveDot}>●</span>
                    <span>LIVE</span>
                    <span className={styles.timer}>1:45</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progress} style={{ width: '28%' }} />
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.venueName}>241 Bar</div>
                  <div className={styles.specialTitle}>Half-Price Wings</div>
                  <div className={styles.address}>241 Main St</div>
                </div>
              </div>
            )}

            {showTile3 && (
              <div className={styles.offerCard}>
                <div className={styles.cardImage}>
                  <div className={styles.imagePlaceholder}>Post photo</div>
                  <div className={styles.distanceTag}>0.7 mi</div>
                  <div className={`${styles.categoryBadge} ${styles.drink}`}>DRINK</div>
                  <div className={styles.liveIndicator}>
                    <span className={styles.liveDot}>●</span>
                    <span>LIVE</span>
                    <span className={styles.timer}>4:10</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progress} style={{ width: '82%' }} />
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.venueName}>The Loft</div>
                  <div className={styles.specialTitle}>Happy Hour</div>
                  <div className={styles.address}>77 Rooftop Ln</div>
                </div>
              </div>
            )}

            {showTile3Locked && (
              <div className={styles.offerCard} onClick={() => setShowAgeModal(true)}>
                <div className={styles.cardImage} style={{ cursor: 'pointer' }}>
                  <div className={styles.imagePlaceholder}>Post photo</div>
                  <div className={styles.lockedOverlay}>🔒 21+ to view</div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.venueName}>The Loft</div>
                  <div className={styles.specialTitle}>Happy Hour</div>
                  <div className={styles.address}>77 Rooftop Ln</div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerLinks}>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
              <a href="#tos">Terms of Service</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#aup">Acceptable Use Policy</a>
            </div>
            <div className={styles.copyright}>© 2026 Nearby Vibes</div>
          </div>

          {/* Bottom Navigation */}
          <div className={styles.bottomNav}>
            <button className={styles.navBtn} title="Grid view">📋</button>
            <button className={styles.navBtn} title="Map view">📍</button>
          </div>
        </div>
      )}
    </div>
  );
}
