# Handoff: Nearby Vibes App

## Overview
Nearby Vibes is a two-sided marketplace app: customers discover time-limited "specials" (drink/food) posted by nearby venues (bars, restaurants); venues create posts, manage their profile, and view analytics. This bundle covers the full customer flow, venue flow, and internal admin tooling, mobile-first (iOS-style device frame) with a couple of desktop/browser-frame admin screens.

## About the Design Files
The files in `screens/` are **design references built in HTML** — high-fidelity prototypes of look, content, and behavior. They are not production code to copy directly. The task is to **recreate these designs in the target codebase's existing environment** (React Native, SwiftUI/Kotlin native, or web React/Vue — whichever the product already uses) using that codebase's existing component patterns, navigation, and state management. If no environment/codebase exists yet, choose the framework best suited to a mobile-first consumer app (typically React Native or a web PWA) and implement there.

Each screen file is self-contained: it renders inside an iOS device frame (`ios-frame.jsx`) or browser window (`browser-window.jsx`) purely for presentation — do not carry those frame components into production, they exist only so the screens preview like a real device/browser in this design tool.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and component states are all intentional — recreate pixel-close using the target codebase's own UI library/primitives (buttons, inputs, cards, etc.), not by embedding this HTML/CSS.

## Design Tokens

**Typography**
- Font family: `Inter` (fallback: `-apple-system, system-ui, sans-serif`)
- Weights used: 500 (light body), 600 (labels/subheads), 700 (buttons/emphasis), 800 (headings)
- Scale in use: 11.5–13px (meta/caption), 13.5–15px (body), 16–19px (subhead), 22–34px (headings)
- Letter-spacing: headings slightly tight (`-0.01em`); uppercase eyebrow labels wide (`0.06em`)

**Color**
- Background (app canvas): `oklch(98% 0.003 90)` — warm near-white
- Card/surface: `#FFFFFF`
- Primary text: `#0A0A0A`
- Secondary text: `rgba(10,10,10,0.5–0.65)` (opacity varies by emphasis)
- Primary accent (purple, links/CTAs): `#7F53F3`
- Accent hover/deep (magenta-purple): `#95048B` — also used as gradient stop with `#7F53F3` for CTA buttons (`linear-gradient(135deg, #95048B, #7F53F3)`)
- Bright accent (drink-special badges / age-gate icon): `#F814E8`
- Success / live / teal accent: `#25EFB8` (live indicator dot, active/positive badges)
- Success text (darker green, e.g. "Create Post", confirmations): `#0A9B71`
- Borders/dividers: `rgba(10,10,10,0.06–0.08)`
- Shadows: soft, e.g. `0 20px 50px rgba(0,0,0,0.15)` on modals/cards; `0 1px 4px rgba(0,0,0,0.1)` on small chips

**Radius**
- Pills/buttons: `999px` (full) or `14px` (rectangular CTAs)
- Cards/sheets: `12–22px`
- Small chips/icons: `8–10px`

**Signature component — decaying timer bar**
Appears on post tiles (Home Tile/Map View), full post view, and Venue Profile posts to show a limited-time special counting down:
- A `LIVE` label with a small `#25EFB8` dot, right-aligned "`X min left`" text in white over the hero image
- A slim horizontal progress bar directly beneath, filled proportionally to time remaining (fill color `#25EFB8` or `#F814E8`/pink depending on urgency — decays/drains left-to-right as time elapses), track at low-opacity white/black depending on background
- Numeric time-remaining is echoed again in the post body under "Active Window" (e.g. `Today · 5:00–9:00 PM` next to `14 min left` in magenta/pink when time is short)

## Screens
All screens live in `screens/`, one `.dc.html` file each. Filenames match the screen name below.

**Customer-facing**
- Home Tile View / Home Map View — main discovery feed, tile grid vs. map toggle, includes age-verification and age-restricted gate modals, hamburger menu, settings sheet
- User Home — signed-in customer home
- Posts — post detail/browsing
- Following Venues — venues the customer follows
- Notifications — trial-follow expiry reminders, post alerts
- My Account — customer account settings
- Account & Sign In — auth flows (sign in/up, password reset with 15-min expiring link)
- QR Landing / Universal Venue QR — what a customer sees scanning a venue's QR code, 48-hour trial-follow enrollment
- Checkout / Subscription — payment/subscription flows
- Report Content — flagging inappropriate posts
- Privacy Policy / Terms of Service / Static Pages — legal/informational content

**Venue-facing**
- Become a Venue — venue signup pitch
- Venue Claim Search — claiming an existing venue listing
- Venue Profile Setup — onboarding a new venue profile
- Venue Profile — public-facing venue page (shows active posts w/ timer bar)
- Venue Home — venue's own dashboard/home
- Post Creation Wizard — multi-step post creation (6 steps), incl. tile/full-post live preview with the decaying timer bar
- Analytics — venue performance metrics
- Team Seat Invite — inviting teammates to a venue account (7-day invite expiry). Now also covers: the "Invite a team member?" prompt shown after Venue Profile Setup (Invite Now / Skip for Later); the invited teammate's invite-link account creation screen (email prefilled from the invite, role shown); their "You're in" welcome landing; and the venue selector a Venue Team Member / Social Content Creator sees when they have access to multiple venues, plus their scoped (owner-features greyed out) dashboard.

**Onboarding / Admin**
- Onboarding — first-run explainer flow
- Admin Portal Login — internal admin auth
- Admin Onboarding Queue — reviewing venue-claim/signup submissions
- Admin Account Management — internal user/account management
- Admin Report Queue — table of user-filed content/venue reports, each with a Mark Reviewed toggle; sidebar nav shows an unreviewed-count badge on "Report Queue" across all admin screens
- Network Dashboard — platform-wide "eagle eye" view one level up from any single venue's dashboard: platform growth, customer growth, venue performance + top 5 high-growth venues, push notification funnel, QR analytics, subscription mix, content stats, top 10 venue leaderboard, geographic insights. Week/Month/Year toggle swaps every stat and chart to period-scoped data.

## Interactions & Behavior
- **Timer bar**: recreate as a live countdown driven by real post start/end timestamps — bar fill = `(now - start) / (end - start)` inverted (drains as time passes), re-render at least once per minute; switch to urgent color when remaining time falls under a threshold (e.g. <15 min).
- **Age verification gate**: shown once per session/device before any drink-special content renders; "I'm 21+" unlocks, "I'm not old enough" or failing the age-restricted retry still allows browsing food-only specials.
- **Hamburger menu / settings sheet**: slide-up sheet from bottom, includes distance-unit toggle (mi/km), persists across sign-in state.
- **QR scan → 48-hour trial follow**: scanning a venue QR auto-enrolls the customer in a 48-hour trial follow of that venue; if they engage with posts during the trial they convert to an organic follower; a reminder notification fires before the trial expires.
- **Sign-in states**: header/menu content changes for signed-out / signed-in customer / signed-in venue — implement as three distinct auth-state variants, not just copy swaps.
- **Password reset**: link expires in 15 minutes (copy + expiry logic to implement server-side, reflected in the "Check your email" screen).
- **Team invite**: invites expire after 7 days if unaccepted.

## State Management
- Auth state: signed-out / customer / venue (drives header, menu, and available actions)
- Age-verification state: unverified / verified-21+ / declined (persist per session)
- Distance unit preference: mi / km
- Post lifecycle: draft → live (with start/end timestamps driving the timer bar) → expired
- Trial-follow state per (customer, venue) pair: none → trial (with expiry timestamp) → organic-follower / expired

## Assets
- `assets/nv-icon.png` — Nearby Vibes app icon/logotype mark, used in headers throughout
- All other imagery in the designs is a labeled placeholder (e.g. "Hero image / video — 9:16 crop") — real photography/video needs to be sourced per venue/post and dropped in at those placeholders.

## Files
See `screens/` for all `.dc.html` design files, plus shared presentation-only helpers used purely for this design tool's previews (not for production use): `ios-frame.jsx`, `browser-window.jsx`, `doc-page.js`, `image-slot.js`, `support.js`.
