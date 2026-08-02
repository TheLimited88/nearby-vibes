'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type AuthState = 'signedOut' | 'customer' | 'venue';
type AgeGate = 'pending' | 'verified' | 'declined';
type SpecialFilter = 'all' | 'drink' | 'food';
type DistanceUnit = 'mi' | 'km';

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [authState, setAuthState] = useState<AuthState>('signedOut');
  const [ageGate, setAgeGate] = useState<AgeGate>('pending');
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showVenueCta, setShowVenueCta] = useState(true);
  const [venueCtaSlide, setVenueCtaSlide] = useState(0);
  const [specialFilter, setSpecialFilter] = useState<SpecialFilter>('all');
  const [distUnit, setDistUnit] = useState<DistanceUnit>('mi');

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('nv_age_gate');
    if (saved === 'verified') setAgeGate('verified');
    else if (saved === 'declined') setAgeGate('declined');
    else {
      setAgeGate('pending');
      setShowAgeModal(true);
    }
  }, []);

  const handleVerifyAge = () => {
    localStorage.setItem('nv_age_gate', 'verified');
    setAgeGate('verified');
    setShowAgeModal(false);
    setShowDecline(false);
  };

  const handleDeclineAge = () => {
    setShowAgeModal(false);
    setShowDecline(true);
  };

  const handleTryAgain = () => {
    setShowDecline(false);
    setShowAgeModal(true);
  };

  const handleContinueBrowsing = () => {
    localStorage.setItem('nv_age_gate', 'declined');
    setAgeGate('declined');
    setShowDecline(false);
  };

  if (!isClient) return null;

  const ageVerified = ageGate === 'verified';
  const showTile1 = specialFilter === 'all' || specialFilter === 'drink';
  const showTile2 = specialFilter === 'all' || specialFilter === 'food';
  const showTile3 = specialFilter === 'all' || specialFilter === 'drink';

  const distLabel = distUnit === 'mi' ? '<0.75mi' : '<1.2km';
  const dist1 = distUnit === 'mi' ? '0.3 mi' : '0.5 km';
  const dist2 = distUnit === 'mi' ? '0.6 mi' : '1.0 km';
  const dist3 = distUnit === 'mi' ? '0.7 mi' : '1.1 km';

  return (
    <div className="w-screen h-screen bg-background overflow-hidden flex flex-col">
      {/* Age Verification Modal */}
      {showAgeModal && (
        <div className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center p-6">
          <div className="w-full bg-surface rounded-[22px] p-7 flex flex-col items-center gap-3.5 shadow-modal max-w-sm">
            <div className="w-[52px] h-[52px] rounded-full bg-accent-bright/12 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M7 9V6.5C7 4 8.8 2 11 2C13.2 2 15 4 15 6.5V9" stroke="#F814E8" strokeWidth="1.7" strokeLinecap="round" />
                <rect x="5.5" y="9" width="11" height="10" rx="3" stroke="#F814E8" strokeWidth="1.7" />
                <path d="M11 12.5V15.5" stroke="#F814E8" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-lg font-bold text-text-primary">Age Verification</div>
            <div className="text-sm text-text-secondary text-center leading-[1.55]">
              Some posts on Nearby Vibes feature drink specials from bars and venues. You must be 21 or older in the US (18+ in other regions) to view this content.
            </div>
            <div className="w-full flex flex-col gap-2 mt-1">
              <button
                onClick={handleVerifyAge}
                className="bg-text-primary text-white text-sm font-bold text-center py-3.5 rounded-[14px] cursor-pointer"
              >
                I'm 21+ (US) / 18+ (Elsewhere)
              </button>
              <button
                onClick={handleDeclineAge}
                className="text-text-tertiary text-xs font-semibold text-center py-2 cursor-pointer"
              >
                I'm not old enough
              </button>
            </div>
            <div className="text-xs text-text-tertiary/35 text-center leading-[1.4]">
              By continuing, you confirm the age information provided is accurate, and agree to our{' '}
              <a href="#tos" className="text-text-tertiary/50 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-text-tertiary/50 underline">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      )}

      {/* Age Declined Screen */}
      {showDecline && (
        <div className="fixed inset-0 z-[61] bg-surface flex flex-col items-center justify-center p-8 gap-4">
          <div className="flex items-center gap-1.5 absolute top-7 left-7">
            <svg width="26" height="26" viewBox="0 0 26 26" className="w-[26px] h-auto" fill="none">
              <circle cx="13" cy="13" r="10" stroke="#0A0A0A" strokeWidth="1.5" />
              <path d="M13 3V13M13 13L19 19" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="text-base font-bold text-text-primary">Nearby Vibes</div>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-bright/15 to-accent-primary/15 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M4.5 7V5A3.5 3.5 0 0111.5 5V7" stroke="#F814E8" strokeWidth="1.6" strokeLinecap="round" />
              <rect x="3" y="7" width="10" height="7.5" rx="2" stroke="#7F53F3" strokeWidth="1.6" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-text-primary text-center">Age Restricted</div>
          <div className="text-sm text-text-secondary text-center leading-[1.55] max-w-xs">
            You must meet the minimum drinking age to view drink specials on Nearby Vibes. You're welcome to keep browsing food specials.
          </div>
          <div className="flex flex-col gap-2.5 w-full max-w-xs mt-2">
            <button
              onClick={handleTryAgain}
              className="bg-cta-gradient text-white text-sm font-bold text-center py-3.5 rounded-[14px] cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={handleContinueBrowsing}
              className="text-accent-primary text-sm font-bold text-center py-2 cursor-pointer"
            >
              Continue Browsing (Food Specials)
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!showDecline && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Hero Section */}
          <div className="relative h-72 flex-shrink-0">
            <div className="absolute inset-0 bg-gray-200" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/5 to-black/35" />

            {/* Header */}
            <div className="absolute top-16 left-5 right-5 flex items-center justify-between gap-1.5 z-20">
              <a href="#" className="flex items-center gap-1.5 no-underline cursor-pointer">
                <svg width="32" height="32" viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="#0A0A0A" strokeWidth="1.5" />
                </svg>
                <div className="text-base font-bold text-text-primary">Nearby Vibes</div>
              </a>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-[10px] bg-white/90 backdrop-blur flex items-center justify-center cursor-pointer shadow-card hover:shadow-modal transition"
                >
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <path d="M1 1H17M1 7H17M1 13H17" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Hero Text */}
            <div className="absolute bottom-5 left-5 right-5">
              <div className="text-[30px] font-bold text-white leading-[1.15]">Live Specials</div>
              <div className="text-[30px] font-bold text-accent-success leading-[1.15]">Near You</div>
            </div>

            {/* Floating Action Button (Venue) */}
            {authState === 'venue' && (
              <button className="absolute bottom-[104px] right-5 w-14 h-14 rounded-full bg-accent-success flex items-center justify-center shadow-lg hover:shadow-xl transition z-15">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2V18M2 10H18" stroke="#0A0A0A" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
            )}

            {/* Bottom Navigation */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
              <div className="bg-white/95 backdrop-blur rounded-full p-1 flex gap-0 shadow-lg pointer-events-auto">
                <div className="px-5.5 py-3 rounded-full bg-accent-success flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="1" width="6" height="6" rx="1.3" fill="#0A0A0A" />
                    <rect x="9" y="1" width="6" height="6" rx="1.3" fill="#0A0A0A" />
                    <rect x="1" y="9" width="6" height="6" rx="1.3" fill="#0A0A0A" />
                    <rect x="9" y="9" width="6" height="6" rx="1.3" fill="#0A0A0A" />
                  </svg>
                </div>
                <button className="px-5.5 py-3 rounded-full flex items-center justify-center hover:bg-background/50 transition">
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path
                      d="M7 15.5S13.5 9.8 13.5 5.7A6.5 6.5 0 001 5.7C1 9.8 7 15.5 7 15.5Z"
                      stroke="#0A0A0A"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <circle cx="7" cy="5.7" r="2.2" fill="#0A0A0A" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Venue CTA */}
            {showVenueCta && (
              <div className="mx-5 mt-3 bg-text-primary rounded-[18px] p-3.5 flex flex-col gap-2 relative">
                <button
                  onClick={() => setShowVenueCta(false)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/12 flex items-center justify-center cursor-pointer z-10"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1L9 9M9 1L1 9" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>

                {venueCtaSlide === 0 ? (
                  <div className="flex gap-3.5 items-start pr-5">
                    <div className="w-10 h-10 rounded-3 bg-accent-success/15 flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                        <path
                          d="M9 1L16.5 4.2V9.3C16.5 14 13.3 17.9 9 19C4.7 17.9 1.5 14 1.5 9.3V4.2L9 1Z"
                          stroke="#25EFB8"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.8 9.6L8 11.8L12.4 7.4"
                          stroke="#25EFB8"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-bold text-white">Own a Venue?</div>
                      <div className="text-xs text-white/65 leading-[1.45] mt-0.5">
                        Get your venue live in minutes and reach more locals today.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3.5 items-start pr-5">
                    <div className="w-10 h-10 rounded-3 bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                        <path
                          d="M8 1C6.3 1 5 2.4 5 4.1V6.5C5 8 4.4 9.4 3.4 10.5L2 12H14L12.6 10.5C11.6 9.4 11 8 11 6.5V4.1C11 2.4 9.7 1 8 1Z"
                          stroke="#7F53F3"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <path d="M6 14.5a2 2 0 004 0" stroke="#7F53F3" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-bold text-white">Add Nearby Vibes to Your Home Screen</div>
                      <div className="text-xs text-white/65 leading-[1.45] mt-0.5">
                        Never miss a deal — get instant alerts when specials drop near you.
                      </div>
                    </div>
                  </div>
                )}

                <button className={`${venueCtaSlide === 0 ? 'bg-accent-success text-text-primary' : 'bg-accent-primary text-white'} text-sm font-bold text-center py-2.5 rounded-3 flex items-center justify-center gap-1.5`}>
                  {venueCtaSlide === 0 ? 'Get Started' : "Let's Go"}
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                    <path
                      d="M1 6H13M13 6L8 1M13 6L8 11"
                      stroke={venueCtaSlide === 0 ? '#0A0A0A' : '#fff'}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="flex justify-between text-xs text-white/55 font-medium">
                  <span>✓ {venueCtaSlide === 0 ? '100% Free' : 'Works like an app'}</span>
                  <span>✓ {venueCtaSlide === 0 ? 'Post in seconds' : 'Instant access'}</span>
                  <span>✓ {venueCtaSlide === 0 ? 'No commitment' : 'Never miss a special'}</span>
                </div>

                <div className="flex justify-center gap-1.5 pt-0.5">
                  <button
                    onClick={() => setVenueCtaSlide(0)}
                    className={`w-1.5 h-1.5 rounded-full ${venueCtaSlide === 0 ? 'bg-white/85' : 'bg-white/25'} cursor-pointer`}
                  />
                  <button
                    onClick={() => setVenueCtaSlide(1)}
                    className={`w-1.5 h-1.5 rounded-full ${venueCtaSlide === 1 ? 'bg-white/85' : 'bg-white/25'} cursor-pointer`}
                  />
                </div>
              </div>
            )}

            {/* Filter Section */}
            <div className="py-3 px-5 flex items-center gap-2.5">
              <div className="text-xs font-bold tracking-wider text-text-primary">ACTIVE OFFERS NEAR YOU</div>
              <div className="bg-text-primary/6 text-text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                {distLabel}
              </div>
              <div className="bg-accent-success/15 text-accent-success_dark text-xs font-bold px-2.5 py-1 rounded-full ml-auto">
                6 live
              </div>
            </div>

            {/* Filter Pills */}
            <div className="px-5 pb-1 flex gap-2">
              <button
                onClick={() => setSpecialFilter('all')}
                className={`text-xs font-bold px-3.5 py-1.75 rounded-full ${specialFilter === 'all' ? 'bg-text-primary text-white' : 'bg-text-primary/6 text-text-primary'}`}
              >
                All
              </button>
              <button
                onClick={() => setSpecialFilter('drink')}
                className={`text-xs font-bold px-3.5 py-1.75 rounded-full ${specialFilter === 'drink' ? 'bg-accent-hover text-white' : 'bg-accent-bright/10 text-accent-hover'}`}
              >
                Drinks
              </button>
              <button
                onClick={() => setSpecialFilter('food')}
                className={`text-xs font-bold px-3.5 py-1.75 rounded-full ${specialFilter === 'food' ? 'bg-accent-primary text-white' : 'bg-accent-primary/10 text-accent-primary'}`}
              >
                Food
              </button>
            </div>

            {/* Post Tiles */}
            <div className="flex gap-3 px-5 py-3 overflow-x-auto flex-shrink-0 pb-6">
              {showTile1 && (
                <PostTile
                  verified={ageVerified}
                  distance={dist1}
                  badge="DRINK"
                  badgeColor="bg-accent-hover"
                  title="Aye Aye"
                  subtitle="2 for 1 Margaritas"
                  address="118 5th Ave"
                  timeRemaining="2:30"
                  fillPercent={68}
                  onClickLocked={() => setShowAgeModal(true)}
                />
              )}
              {showTile2 && (
                <PostTile
                  verified={true}
                  distance={dist2}
                  badge="FOOD"
                  badgeColor="bg-accent-primary"
                  title="241 Bar"
                  subtitle="Half-Price Wings"
                  address="241 Main St"
                  timeRemaining="1:45"
                  fillPercent={28}
                  onClickLocked={() => {}}
                />
              )}
              {showTile3 && (
                <PostTile
                  verified={ageVerified}
                  distance={dist3}
                  badge="DRINK"
                  badgeColor="bg-accent-hover"
                  title="The Loft"
                  subtitle="Happy Hour"
                  address="77 Rooftop Ln"
                  timeRemaining="4:10"
                  fillPercent={82}
                  onClickLocked={() => setShowAgeModal(true)}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center gap-3 py-6 border-t border-text-primary/8 mx-5">
              <div className="flex flex-wrap justify-center gap-3.5">
                {['Home', 'About', 'FAQ', 'Contact', 'Terms of Service', 'Privacy Policy', 'Acceptable Use Policy'].map((link) => (
                  <a key={link} href="#" className="text-xs font-semibold text-text-secondary no-underline">
                    {link}
                  </a>
                ))}
              </div>
              <div className="text-xs text-text-tertiary">© 2026 Nearby Vibes</div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Drawer */}
      {menuOpen && (
        <>
          <button
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[20] bg-black/30"
            style={{ top: '0', left: '0', right: '0', bottom: '0' }}
          />
          <div className="fixed top-0 left-0 bottom-0 w-[250px] bg-surface z-[21] shadow-lg p-[70px_22px_24px] flex flex-col gap-0.5 overflow-y-auto">
            {/* Profile Item */}
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2.5 p-2 mb-2.5 rounded-[10px] bg-text-primary/5 cursor-pointer"
            >
              <div className="w-8.5 h-8.5 rounded-full bg-surface flex items-center justify-center flex-shrink-0 shadow-card">
                {authState === 'venue' ? (
                  <svg width="16" height="14" viewBox="0 0 18 16" fill="none">
                    <path d="M1 5L2.5 1H15.5L17 5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M1 5V15H17V5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M1 5C1 6.5 2.2 7.5 3.5 7.5S6 6.5 6 5" stroke="#0A0A0A" strokeWidth="1.5" />
                    <path d="M6 5C6 6.5 7.2 7.5 8.5 7.5S11 6.5 11 5" stroke="#0A0A0A" strokeWidth="1.5" />
                    <path d="M11 5C11 6.5 12.2 7.5 13.5 7.5S16 6.5 16 5" stroke="#0A0A0A" strokeWidth="1.5" />
                  </svg>
                ) : (
                  <svg width="14" height="16" viewBox="0 0 16 18" fill="none">
                    <circle cx="8" cy="5" r="4" stroke="#0A0A0A" strokeWidth="1.6" />
                    <path d="M1 17c0-4 3-6 7-6s7 2 7 6" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                {authState === 'signedOut' ? (
                  <>
                    <div className="text-sm font-bold text-text-primary">Sign in / Create account</div>
                    <div className="text-xs text-text-tertiary">Customer or Venue</div>
                  </>
                ) : authState === 'customer' ? (
                  <>
                    <div className="text-sm font-bold text-text-primary">My Account</div>
                    <div className="text-xs text-text-tertiary">Signed in as Customer</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-text-primary">Venue Account</div>
                    <div className="text-xs text-text-tertiary">Signed in as Venue</div>
                  </>
                )}
              </div>
            </button>

            {authState === 'venue' && (
              <a href="/venue/create-post" className="flex items-center gap-2 p-2.75 mb-2.5 rounded-[10px] bg-accent-success/15 no-underline">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2V18M2 10H18" stroke="#0A9B71" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                <span className="text-xs font-bold text-accent-success_dark">Create Post</span>
              </a>
            )}

            <div className="h-0.5 bg-text-primary/8 my-1 mx-2 mb-2.5" />

            <a href="#" className="block px-2 py-3 text-base font-semibold text-text-primary no-underline rounded-2">
              Home
            </a>
            <a href="/venue/signup" className="block px-2 py-3 text-base font-semibold text-accent-success_dark no-underline rounded-2">
              Become a Venue
            </a>
            <a href="#" className="block px-2 py-3 text-base font-semibold text-text-primary no-underline rounded-2">
              About
            </a>
            <a href="#" className="block px-2 py-3 text-base font-semibold text-text-primary no-underline rounded-2">
              FAQ
            </a>
            <a href="#" className="block px-2 py-3 text-base font-semibold text-text-primary no-underline rounded-2">
              Contact
            </a>

            <div className="h-0.5 bg-text-primary/8 my-2.5 mx-2" />

            <a href="#" className="block px-2 py-3 text-xs font-medium text-text-secondary no-underline rounded-2">
              Terms of Service
            </a>
            <a href="#" className="block px-2 py-3 text-xs font-medium text-text-secondary no-underline rounded-2">
              Privacy Policy
            </a>
            <a href="#" className="block px-2 py-3 text-xs font-medium text-text-secondary no-underline rounded-2">
              Acceptable Use Policy
            </a>

            <div className="h-0.5 bg-text-primary/8 my-2.5 mx-2" />

            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 px-2 py-3 text-base font-semibold text-text-primary cursor-pointer rounded-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2.4" stroke="#0A0A0A" strokeWidth="1.5" />
                <path
                  d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.3 3.3L4.4 4.4M11.6 11.6L12.7 12.7M3.3 12.7L4.4 11.6M11.6 4.4L12.7 3.3"
                  stroke="#0A0A0A"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Settings
            </button>
          </div>
        </>
      )}

      {/* Settings Sheet */}
      {settingsOpen && (
        <>
          <button
            onClick={() => setSettingsOpen(false)}
            className="fixed inset-0 z-[24] bg-black/35"
          />
          <div className="fixed left-0 right-0 bottom-0 bg-surface rounded-t-[20px] z-[25] shadow-lg p-2.5 pb-7">
            <div className="w-9 h-1 rounded-full bg-text-primary/15 mx-auto mb-4" />
            <div className="text-lg font-bold text-text-primary px-1 pb-1">Settings</div>
            <div className="text-xs text-text-tertiary px-1 pb-3.5">Available whether or not you're signed in.</div>
            <div className="text-xs font-semibold text-text-primary px-1 pb-2">Units of Distance</div>
            <div className="flex gap-1.5 px-1">
              <button
                onClick={() => setDistUnit('mi')}
                className={`flex-1 text-center py-2.75 rounded-3 text-xs font-bold ${distUnit === 'mi' ? 'bg-text-primary text-white' : 'border-1.5 border-text-primary/15 text-text-primary'} cursor-pointer`}
              >
                Miles
              </button>
              <button
                onClick={() => setDistUnit('km')}
                className={`flex-1 text-center py-2.75 rounded-3 text-xs font-bold ${distUnit === 'km' ? 'bg-text-primary text-white' : 'border-1.5 border-text-primary/15 text-text-primary'} cursor-pointer`}
              >
                Kilometers
              </button>
            </div>
            <div className="text-xs text-text-tertiary/40 px-1 pt-2">Defaults to Miles. Applies to distances shown across the app — no account needed.</div>
          </div>
        </>
      )}

      {/* Profile Sheet */}
      {profileOpen && (
        <>
          <button
            onClick={() => setProfileOpen(false)}
            className="fixed inset-0 z-[22] bg-black/35"
          />
          <div className="fixed left-0 right-0 bottom-0 bg-surface rounded-t-[20px] z-[23] shadow-lg p-2.5 pb-7">
            <div className="w-9 h-1 rounded-full bg-text-primary/15 mx-auto mb-4" />

            {authState === 'signedOut' ? (
              <>
                <div className="text-lg font-bold text-text-primary px-1 pb-4">Account</div>
                <button
                  onClick={() => {
                    setAuthState('customer');
                    setProfileOpen(false);
                  }}
                  className="w-full bg-text-primary text-white font-bold text-base text-center py-3.75 rounded-[14px] cursor-pointer mb-2.5"
                >
                  Continue as Customer
                </button>
                <button
                  onClick={() => {
                    setAuthState('venue');
                    setProfileOpen(false);
                  }}
                  className="w-full bg-text-primary/6 text-text-primary font-bold text-base text-center py-3.75 rounded-[14px] cursor-pointer"
                >
                  Continue as Venue
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5 px-1 pb-3.5">
                  <div className="w-10 h-10 rounded-full bg-text-primary/6 flex items-center justify-center flex-shrink-0">
                    {authState === 'venue' ? (
                      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                        <path d="M1 5L2.5 1H15.5L17 5" stroke="#0A9B71" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M1 5V15H17V5" stroke="#0A9B71" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                        <circle cx="8" cy="5" r="4" stroke="#0A0A0A" strokeWidth="1.6" />
                        <path d="M1 17c0-4 3-6 7-6s7 2 7 6" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <div className="text-base font-bold text-text-primary">{authState === 'venue' ? 'Venue' : 'Customer'} Account</div>
                </div>
                <a href="/account" className="block px-2 py-3 text-base font-semibold text-text-primary no-underline">
                  {authState === 'venue' ? 'Dashboard' : 'My Account'}
                </a>
                {authState === 'customer' && (
                  <>
                    <a href="#" className="block px-2 py-3 text-base font-semibold text-text-primary no-underline">
                      Following Venues
                    </a>
                    <a href="#" className="block px-2 py-3 text-base font-semibold text-text-primary no-underline">
                      Notifications
                    </a>
                  </>
                )}
                {authState === 'venue' && (
                  <>
                    <a href="/venue/create-post" className="block px-2 py-3 text-base font-semibold text-text-primary no-underline">
                      Create Post
                    </a>
                    <a href="/venue/analytics" className="block px-2 py-3 text-base font-semibold text-text-primary no-underline">
                      Analytics
                    </a>
                  </>
                )}
                <div className="h-0.5 bg-text-primary/8 my-2 mx-2" />
                <button
                  onClick={() => {
                    setAuthState('signedOut');
                    setProfileOpen(false);
                  }}
                  className="block w-full text-left px-2 py-3 text-base font-semibold text-red-600 cursor-pointer"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface PostTileProps {
  verified: boolean;
  distance: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  address: string;
  timeRemaining: string;
  fillPercent: number;
  onClickLocked: () => void;
}

function PostTile({
  verified,
  distance,
  badge,
  badgeColor,
  title,
  subtitle,
  address,
  timeRemaining,
  fillPercent,
  onClickLocked,
}: PostTileProps) {
  return (
    <div className="flex-shrink-0 w-42 flex flex-col gap-2">
      <div
        className="relative w-42 h-52.5 rounded-4 overflow-hidden cursor-pointer group"
        onClick={onClickLocked}
      >
        <div className="absolute inset-0 bg-gray-200 group-hover:bg-gray-300 transition" />
        {!verified && (
          <>
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/75 text-white text-xs font-bold px-3.5 py-2.5 rounded-2.5 text-center flex flex-col items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4.5 7V5A3.5 3.5 0 0111.5 5V7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                  <rect x="3" y="7" width="10" height="7.5" rx="2" fill="#fff" />
                </svg>
                21+ to view
              </div>
            </div>
          </>
        )}
        {verified && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/5 to-black/65" />
            <div className="absolute top-2 left-2 bg-white/90 text-text-primary text-xs font-bold px-2 py-0.75 rounded-full">
              {distance}
            </div>
            <div className={`absolute top-2 right-2 ${badgeColor} text-white text-xs font-bold px-1.75 py-0.75 rounded-full`}>
              {badge}
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.25">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-success" />
              <span className="text-xs font-bold text-white">LIVE</span>
              <span className="text-xs font-semibold text-white/85 ml-auto">{timeRemaining}</span>
            </div>
            <div className="absolute bottom-0.75 left-2 right-2 h-0.75 rounded-full bg-white/30 overflow-hidden">
              <div
                className={`h-full ${fillPercent > 20 ? 'bg-accent-bright' : 'bg-accent-success'} rounded-full`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </>
        )}
      </div>
      <div className="text-sm font-bold text-text-primary">{title}</div>
      <div className="text-xs text-text-secondary">{subtitle}</div>
      <div className="text-xs text-text-tertiary">{address}</div>
    </div>
  );
}
