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

  const mi = unit === 'mi';
  const ageVerified = ageGate === 'verified';
  const isSignedOut = authState === 'signedOut';
  const isCustomer = authState === 'customer';
  const isVenue = authState === 'venue';

  const showTile1 = (specialFilter === 'all' || specialFilter === 'drink') && ageVerified;
  const showTile1Locked = (specialFilter === 'all' || specialFilter === 'drink') && !ageVerified;
  const showTile2 = specialFilter === 'all' || specialFilter === 'food';
  const showTile3 = (specialFilter === 'all' || specialFilter === 'drink') && ageVerified;
  const showTile3Locked = (specialFilter === 'all' || specialFilter === 'drink') && !ageVerified;

  const distHeader = mi ? '<0.75mi' : '<1.2km';

  return (
    <div className={styles.container}>
      {showAgeModal && (
        <div className={styles.ageModalOverlay}>
          <div className={styles.ageModal}>
            <div className={styles.ageModalIcon}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M7 9V6.5C7 4 8.8 2 11 2C13.2 2 15 4 15 6.5V9" stroke="#F814E8" strokeWidth="1.7" strokeLinecap="round"/>
                <rect x="5.5" y="9" width="11" height="10" rx="3" stroke="#F814E8" strokeWidth="1.7"/>
                <path d="M11 12.5V15.5" stroke="#F814E8" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
            </div>
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

      {showDecline && (
        <div className={styles.ageRestrictedContainer}>
          <div className={styles.logoHeader}>
            <img src="/nv-icon.png" alt="NV" style={{ height: 26 }} />
            <span>Nearby Vibes</span>
          </div>
          <div className={styles.ageRestrictedIcon}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M4.5 7V5A3.5 3.5 0 0111.5 5V7" stroke="#F814E8" strokeWidth="1.6" strokeLinecap="round"/>
              <rect x="3" y="7" width="10" height="7.5" rx="2" stroke="#7F53F3" strokeWidth="1.6"/>
            </svg>
          </div>
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

      {!showDecline && (
        <div className={styles.mainContent}>
          {/* HERO SECTION */}
          <div className={styles.hero}>
            <div className={styles.heroImage}>Hero — venue crowd / nightlife</div>
            <div className={styles.heroGradient} />

            {/* HEADER */}
            <header className={styles.header}>
              <div className={styles.logo}>
                <img src="/nv-icon.png" alt="NV" style={{ height: 32 }} />
                <span>Nearby Vibes</span>
              </div>
              <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <path d="M1 1H17M1 7H17M1 13H17" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </header>

            {/* MENU SIDEBAR */}
            {menuOpen && (
              <>
                <div className={styles.menuOverlay} onClick={() => setMenuOpen(false)} />
                <div className={styles.sidebar}>
                  <div className={styles.profileBtn} onClick={() => { setProfileOpen(!profileOpen); setMenuOpen(false); }}>
                    <div className={styles.profileIcon}>
                      {isVenue ? (
                        <svg width="16" height="14" viewBox="0 0 18 16" fill="none">
                          <path d="M1 5L2.5 1H15.5L17 5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinejoin="round"/>
                          <path d="M1 5V15H17V5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinejoin="round"/>
                          <path d="M1 5C1 6.5 2.2 7.5 3.5 7.5S6 6.5 6 5" stroke="#0A0A0A" strokeWidth="1.5"/>
                          <path d="M6 5C6 6.5 7.2 7.5 8.5 7.5S11 6.5 11 5" stroke="#0A0A0A" strokeWidth="1.5"/>
                          <path d="M11 5C11 6.5 12.2 7.5 13.5 7.5S16 6.5 16 5" stroke="#0A0A0A" strokeWidth="1.5"/>
                        </svg>
                      ) : (
                        <svg width="14" height="16" viewBox="0 0 16 18" fill="none">
                          <circle cx="8" cy="5" r="4" stroke="#0A0A0A" strokeWidth="1.6"/>
                          <path d="M1 17c0-4 3-6 7-6s7 2 7 6" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
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
                    <div className={styles.createPostBtn}>
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2V18M2 10H18" stroke="#0A9B71" strokeWidth="2.2" strokeLinecap="round"/>
                      </svg>
                      <span>Create Post</span>
                    </div>
                  )}
                  <div className={styles.menuDivider} />
                  <a href="#home" className={styles.menuItem}>Home</a>
                  <a href="#become-venue" className={styles.menuItemVenue}>Become a Venue</a>
                  <a href="#about" className={styles.menuItem}>About</a>
                  <a href="#faq" className={styles.menuItem}>FAQ</a>
                  <a href="#contact" className={styles.menuItem}>Contact</a>
                  <div className={styles.menuDivider} />
                  <a href="#tos" className={styles.menuItemSmall}>Terms of Service</a>
                  <a href="#privacy" className={styles.menuItemSmall}>Privacy Policy</a>
                  <a href="#aup" className={styles.menuItemSmall}>Acceptable Use Policy</a>
                  <div className={styles.menuDivider} />
                  <button onClick={() => setSettingsOpen(true)} className={styles.settingsBtn}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="2.4" stroke="#0A0A0A" strokeWidth="1.5"/>
                      <path d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.3 3.3L4.4 4.4M11.6 11.6L12.7 12.7M3.3 12.7L4.4 11.6M11.6 4.4L12.7 3.3" stroke="#0A0A0A" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    Settings
                  </button>
                </div>
              </>
            )}

            {/* HERO TEXT */}
            <div className={styles.heroText}>
              <div>Live Specials</div>
              <div>Near You</div>
            </div>
          </div>

          {/* CTA CARD */}
          <div className={styles.ctaCard}>
            <button className={styles.closeCtaBtn}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1L9 9M9 1L1 9" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>

            {venueCtaSlide === 0 && (
              <div className={styles.ctaSlide}>
                <div className={styles.ctaContent}>
                  <div className={styles.ctaIcon}>
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                      <path d="M9 1L16.5 4.2V9.3C16.5 14 13.3 17.9 9 19C4.7 17.9 1.5 14 1.5 9.3V4.2L9 1Z" stroke="#25EFB8" strokeWidth="1.6" strokeLinejoin="round"/>
                      <path d="M5.8 9.6L8 11.8L12.4 7.4" stroke="#25EFB8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.ctaHeading}>Own a Venue?</div>
                    <div className={styles.ctaDesc}>Get your venue live in minutes and reach more locals today.</div>
                  </div>
                </div>
                <a href="#become-venue" className={styles.ctaButton}>
                  Get Started
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                    <path d="M1 6H13M13 6L8 1M13 6L8 11" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                <div className={styles.ctaContent}>
                  <div className={styles.ctaIcon2}>
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                      <path d="M8 1C6.3 1 5 2.4 5 4.1V6.5C5 8 4.4 9.4 3.4 10.5L2 12H14L12.6 10.5C11.6 9.4 11 8 11 6.5V4.1C11 2.4 9.7 1 8 1Z" stroke="#7F53F3" strokeWidth="1.6" strokeLinejoin="round"/>
                      <path d="M6 14.5a2 2 0 004 0" stroke="#7F53F3" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.ctaHeading}>Add Nearby Vibes to Your Home Screen</div>
                    <div className={styles.ctaDesc}>Never miss a deal — get instant alerts when specials drop near you.</div>
                  </div>
                </div>
                <div className={styles.ctaButton2}>
                  Let's Go
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                    <path d="M1 6H13M13 6L8 1M13 6L8 11" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
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

          {/* OFFERS HEADER */}
          <div className={styles.offersHeader}>
            <div className={styles.offersTitle}>ACTIVE OFFERS NEAR YOU</div>
            <div className={styles.distanceBadge}>{distHeader}</div>
            <div className={styles.liveBadge}>6 live</div>
          </div>

          {/* FILTER BUTTONS */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${specialFilter === 'all' ? styles.active : ''}`}
              onClick={() => setSpecialFilter('all')}
            >
              All
            </button>
            <button
              className={`${styles.filterBtn} ${specialFilter === 'drink' ? styles.activeDrink : ''}`}
              onClick={() => setSpecialFilter('drink')}
            >
              Drinks
            </button>
            <button
              className={`${styles.filterBtn} ${specialFilter === 'food' ? styles.activeFood : ''}`}
              onClick={() => setSpecialFilter('food')}
            >
              Food
            </button>
          </div>

          {/* OFFER CARDS */}
          <div className={styles.offersList}>
            {showTile1 && (
              <div className={styles.offerCard}>
                <div className={styles.cardImage}>
                  <div className={styles.imagePlaceholder}>Post photo</div>
                  <div className={styles.distanceTag}>0.3 mi</div>
                  <div className={`${styles.categoryBadge} ${styles.drink}`}>DRINK</div>
                  <div className={styles.liveIndicator}>
                    <div className={styles.liveDot} />
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
                <div className={styles.cardImageLocked}>
                  <div className={styles.imagePlaceholder}>Post photo</div>
                  <div className={styles.lockedOverlay}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4.5 7V5A3.5 3.5 0 0111.5 5V7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
                      <rect x="3" y="7" width="10" height="7.5" rx="2" fill="#fff"/>
                    </svg>
                    21+ to view
                  </div>
                  <div className={styles.distanceTag}>0.3 mi</div>
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
                    <div className={styles.liveDot} />
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
                    <div className={styles.liveDot} />
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
                <div className={styles.cardImageLocked}>
                  <div className={styles.imagePlaceholder}>Post photo</div>
                  <div className={styles.lockedOverlay}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4.5 7V5A3.5 3.5 0 0111.5 5V7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
                      <rect x="3" y="7" width="10" height="7.5" rx="2" fill="#fff"/>
                    </svg>
                    21+ to view
                  </div>
                  <div className={styles.distanceTag}>0.7 mi</div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.venueName}>The Loft</div>
                  <div className={styles.specialTitle}>Happy Hour</div>
                  <div className={styles.address}>77 Rooftop Ln</div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
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

          {/* BOTTOM NAVIGATION */}
          <div className={styles.bottomNav}>
            <div className={styles.navGrid}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.3" fill="#0A0A0A"/>
                <rect x="9" y="1" width="6" height="6" rx="1.3" fill="#0A0A0A"/>
                <rect x="1" y="9" width="6" height="6" rx="1.3" fill="#0A0A0A"/>
                <rect x="9" y="9" width="6" height="6" rx="1.3" fill="#0A0A0A"/>
              </svg>
            </div>
            <div className={styles.navMap}>
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M7 15.5S13.5 9.8 13.5 5.7A6.5 6.5 0 001 5.7C1 9.8 7 15.5 7 15.5Z" stroke="#0A0A0A" strokeWidth="1.6" strokeLinejoin="round"/>
                <circle cx="7" cy="5.7" r="2.2" fill="#0A0A0A"/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
