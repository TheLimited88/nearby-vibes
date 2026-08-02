# Design Implementation Plan - Exact Screen Rebuilds

This document tracks the systematic rebuild of all 27 design screens to match the Claude Design handoff EXACTLY.

## Status: In Progress

**Completed Screens:**
1. ✅ Home Tile View - EXACT match to design
   - Age verification modal
   - Menu drawer with all states
   - Settings sheet (distance units)
   - Profile sheet (account states)
   - Venue CTA carousel (2 slides)
   - Post tile grid with timer bars
   - Bottom navigation (tile/map toggle)
   - Footer with links

## Screens to Build (Priority Order)

### Priority Tier 1: Critical Customer Flows

**2. Posts (Venue Post Manager)**
- Status: Design analyzed
- Components:
  - 5 tabs: Active, Scheduled, Drafts, Archive
  - Search functionality (Scheduled, Drafts, Archive)
  - Post items with thumbnails
  - Action buttons (Edit, Duplicate, Delete/Cancel/End Early)
  - Confirmation modals for destructive actions
  - Bottom navigation
  - Empty states
- Complexity: HIGH (multiple tabs, modals, search)
- Tokens needed: ~800-1000

**3. Account & Sign In**
- Sign in screen
- Sign up screen
- Password reset request
- Password reset confirmation
- Email verification screen
- Features: Form validation, error states

**4. Subscription/Checkout**
- Plan selection (Free/Premium)
- Payment entry form
- Trial information
- Success/confirmation screens

**5. Venue Profile Setup (Onboarding Wizard)**
- Multi-step form
- Profile photo upload
- Location/address entry
- Venue details
- Team seat invite prompt
- Completion screen

**6. Post Creation Wizard**
- 6-step flow
- Step 1: Title
- Step 2: Description
- Step 3: Start time
- Step 4: End time
- Step 5: Image upload
- Step 6: Preview & publish
- Live timer bar preview

### Priority Tier 2: Important Screens

**7. My Account (Customer)**
- Profile info
- Settings (distance units, notifications)
- Sign out

**8. Following Venues**
- List of followed venues
- Trial status indicators
- Follow/unfollow actions

**9. Notifications**
- Trial expiry reminders
- Post alerts
- Subscription updates
- Notification list with timestamps

**10. Venue Profile (Customer View)**
- Hero image
- Venue info (name, address, rating)
- Follow button
- Active posts grid
- Timer bars on each post

**11. Analytics (Venue Dashboard)**
- Key metrics (impressions, clicks, engagement)
- Time period toggle (day/week/month)
- Charts and graphs
- Top performing posts
- Push notification funnel

**12. Venue Home (Dashboard)**
- Overview stats
- Create post CTA
- Posts list (with status badges)
- Quick analytics
- Settings link

**13. QR Landing / Universal Venue QR**
- Venue QR code display
- Scan analytics
- Trial follow info

### Priority Tier 3: Admin/Less Critical

**14. Admin Portal Login**
- Email + password fields
- TOTP/MFA second step
- Bot detection (Cloudflare Turnstile placeholder)

**15. Admin Dashboard**
- Key metrics
- Quick action cards
- Links to sub-sections
- Report queue badge with count

**16. Admin Report Queue**
- Content/venue reports table
- Mark reviewed toggle
- Report details
- Sidebar with unreviewed count badge

**17. Admin Onboarding Queue**
- Venue signup submissions
- Approve/reject actions
- Venue details

**18. Network Dashboard**
- Platform-wide analytics
- Growth metrics
- Top venues leaderboard
- Geographic distribution
- Push funnel chart
- QR analytics

**19. Team Seat Invite**
- Send invite form
- Invite link screen
- Accept invite flow
- Role selection
- Seat limit notifications

### Static Pages (Lower Priority)

**20. Terms of Service**
**21. Privacy Policy**
**22. Static Pages (About, FAQ, Contact)**
**23. Home Map View**
- Alternative to tile view
- Same data, different layout
- Map rendering with pins

## Implementation Strategy

### Per-Screen Checklist

For each screen, follow this checklist:
- [ ] Read the `.dc.html` design file
- [ ] Extract exact layout structure
- [ ] Identify all UI states (active, hover, disabled, empty, loading, error)
- [ ] List all interactions (clicks, form submissions, modals)
- [ ] Build React component with:
  - State management for all states
  - Exact styling matching design tokens
  - All interactions implemented
  - Proper keyboard/a11y support
- [ ] Verify against design file
- [ ] Commit with detailed message

### Design Token References (Confirmed)

**Colors:**
- Background: `#faf8f6` (oklch(98% 0.003 90))
- Surface: `#FFFFFF`
- Text primary: `#0A0A0A`
- Text secondary: `rgba(10,10,10,0.65)`
- Text tertiary: `rgba(10,10,10,0.5)`
- Primary accent (purple): `#7F53F3`
- Hover/deep (magenta): `#95048B`
- Bright (pink): `#F814E8`
- Success/teal: `#25EFB8`
- Success dark: `#0A9B71`
- Borders: `rgba(10,10,10,0.06-0.08)`

**Typography:**
- Font: Inter (weights 500/600/700/800)
- Sizes: 11.5px, 13.5px, 15px, 16px, 19px, 22px, 26px, 30px, 34px

**Spacing/Radius:**
- Pills/buttons: 999px (full) or 14px
- Cards: 12-22px
- Small: 8-10px

**Shadows:**
- Card: `0 1px 4px rgba(0,0,0,0.1)`
- Modal: `0 20px 50px rgba(0,0,0,0.15)`

## Build Timeline Estimate

- **Home Page**: ✅ COMPLETE (690 lines)
- **Posts Dashboard**: 15-20 min (~1000 tokens)
- **Auth Pages**: 15-20 min (~800 tokens)  
- **Checkout**: 10-15 min (~600 tokens)
- **Venue Setup**: 20-25 min (~1200 tokens)
- **Post Creator**: 20-25 min (~1500 tokens)
- **Account/Profile Pages**: 10-15 min each (~500-600 tokens each)
- **Analytics**: 15-20 min (~1000 tokens)
- **Admin Pages**: 10-15 min each (~600-800 tokens each)
- **Static Pages**: 5-10 min each (~300-400 tokens each)

**Total Estimated Tokens**: ~10,000-12,000  
**Total Estimated Time**: 4-6 developer-hours

## Key Implementation Notes

1. **Reusable Components**: After building 3-4 screens, extract common components:
   - BottomSheet (for modals/settings)
   - TabBar (used in Posts, Analytics, Venue Home)
   - PostTile (reusable across feeds)
   - ActionButton (with icon support)
   - EmptyState
   - StatCard

2. **State Management**: Use Zustand for:
   - Auth state (user, role)
   - Age verification
   - Distance unit preference
   - Menu/sheet visibility

3. **Navigation**: Set up Next.js app router with:
   - `/` - Home (landing)
   - `/home` - Home feed (signed-in customer)
   - `/posts` - Venue post manager
   - `/auth/signin` - Sign in
   - `/auth/signup` - Sign up
   - `/venue/setup` - Venue setup wizard
   - `/venue/create-post` - Post creation wizard
   - `/venue/dashboard` - Venue home
   - `/account` - Customer account
   - `/checkout` - Subscription
   - `/admin/login` - Admin login
   - `/admin/dashboard` - Admin home
   - `/admin/reports` - Report queue
   - `/analytics` - Venue analytics
   - `/terms`, `/privacy` - Static pages

4. **Testing Each Screen**:
   - Open side-by-side with design file
   - Verify every pixel, color, spacing
   - Test all interactions
   - Check responsive behavior
   - Verify hover/active states

## Next Steps

1. Continue with Posts dashboard (Tier 1, Priority 2)
2. Build Account & Sign In screens
3. Build Checkout/Subscription flow
4. Gradually work through Tier 2
5. Complete admin and static pages last

Each completed screen will be committed with detailed message showing what was built and verified.

---

**Last Updated**: August 1, 2024  
**Repository**: `/Users/brettwilliams/Desktop/nearby-vibes`  
**Design Reference**: `/tmp/design_handoff_nearby_vibes/screens/`
