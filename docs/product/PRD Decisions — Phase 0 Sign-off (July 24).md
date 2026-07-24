# PRD decisions — Phase 0 sign-off (confirmed July 24, 2026)

Resolves the five open items from the Technical Implementation Plan §4, plus one related sub-item surfaced while discussing item 3 (trial-start trigger, Appendix A item 6(b)). Written to be merged into PRD v1.9 alongside the §17.2/§17.3 rewrites and the v1.4 design addendum already in this folder.

---

## 1. Repo structure — Monorepo (confirmed)

Single monorepo containing the Next.js frontend and NestJS backend (e.g., pnpm/Turborepo workspaces), with a shared TypeScript types package between the two. Resolves Roadmap Phase 0's open flag ("confirm monorepo vs. split repos before…").

## 2. Subscription renewal grace window — 3 days (confirmed)

§21.2's existing default stands as final, not provisional. Remove the "should be confirmed by Product before launch" caveat — 3 days between `past_due` and automatic downgrade to Free is locked. Still implemented as configuration, not a hardcoded constant.

## 3. Founding Venue Program & Promo Code — one mechanism, two issuance paths (confirmed)

Confirms §10.12's existing data model (shared `promo_codes` table, `program_type` flag) was the right shape — the two "offers" are not the same thing, but they are the same underlying mechanism:

- **Founding Venue Program:** auto-eligible, capped at the first 50 Manhattan venues, 50% off (Annual-for-a-year or Monthly-capped-at-12-cycles per REQ-SUB-008), plus the non-monetary perks (badge, priority support, roadmap input, early access) already listed in §10.12.
- **Discretionary Promo Code:** same 50%-off shape, issued manually per venue after an off-platform conversation with the venue. Not auto-eligible, not capped at 50, no Founding Venue badge/perks.
- **UI (confirmed):** venues never see two different paths — checkout has exactly one "Promo Code" field, matching the existing design and REQ-SUB-011–015. Which underlying `program_type` a redeemed code maps to is invisible to the venue at redemption time (Founding Venue status becomes visible after redemption per REQ-SUB-019, discretionary codes don't surface a special badge at all).

**Correction:** promo codes — both the Founding Venue code and every discretionary code — are created and managed directly in the **Paddle dashboard**, not in a Nearby Vibes admin screen. This removes REQ-SUB-022 as originally drafted (no NV-side promo-code creation UI needed) and simplifies §10.12/§10.13/§21.4 in three ways:

- **Checkout:** the existing "Promo Code" field (REQ-SUB-011–015) passes the code straight through to Paddle's checkout session as a native Paddle discount code — NV doesn't validate, store the definition of, or manage the code itself, only what Paddle's webhook reports back.
- **Founding Venue's 50-venue cap:** recommend enforcing this via a single reusable Founding Venue coupon in Paddle with its own usage-limit set to 50, rather than NV's own atomic row-locked counter. This likely simplifies or removes the §21.4 "Founding Venue cap concurrency" custom logic — **confirm Paddle's discount usage-limit feature covers this before removing NV's own cap-check entirely**, since that's an assumption about Paddle's product, not something already verified.
- **Founding Venue badge / reporting (REQ-SUB-019, §17.4 "Founding Venue slots used/remaining, promo-code redemption rate"):** NV still needs to know, per successful checkout, whether the Paddle discount applied was *the* Founding Venue coupon (to show the badge and count toward the 50) versus some other discretionary code (discount only, no badge) versus none. This only requires a small config value — the known Founding Venue coupon ID from Paddle — checked against the discount ID in Paddle's webhook payload at subscription-creation time. No `promo_codes` creation/management table is needed; a lightweight record of "which Paddle discount ID applied to this subscription" (for reporting) is sufficient.

### Related — trial-start trigger (Appendix A item 6(b), also resolved)

§10.11 currently sets the trial-start trigger as **venue-claim completion** (the moment `venues.created_at`/Claimed-state is reached), explicitly *not* profile completion. Your description of onboarding — "a venue has only completed onboarding once they have created an account and created a venue profile; they are then ready to post" — resolves this the other way.

**REQ-SUB-001 (amended):** The 14-day trial shall start at **venue profile setup completion** (the point at which the venue is fully onboarded and able to create posts), not at bare venue-claim completion. Engineering should treat the Venue Profile Setup completion event/timestamp as the trial anchor instead of `venues.created_at`, and confirm this doesn't conflict with any claim-to-profile-setup abandonment handling in §10.16 (Trial & re-claim abuse prevention) — a venue that claims but never finishes profile setup should not be treated as having started (and potentially burned) its one-time trial.

## 4. Admin portal — confirmed as already specified, ready to build

No PRD change needed — this confirms §10.14/REQ-ADMIN-010–013 as written matches intent:
- Path/subdomain: a non-guessable value, not a predictable subpath of the main domain (not `/admin`-style) — generated as a secret, never committed to source, distributed to admin staff out-of-band.
- Login: business email + password + mandatory TOTP second factor — standard TOTP is Google Authenticator–compatible by protocol, no vendor-specific integration needed.
- Protection: Cloudflare Turnstile + Bot Management + stricter rate limiting on login/MFA endpoints (already in §10.14).
- Access: Admin (you) is the primary/only login for MVP — matches REQ-ADMIN-010–013 as scoped.

Action item: generate and store the actual path value before Phase 1.5 starts, not during it (per the plan's existing note in §4).

## 5. Color roles — Design Handoff palette is canonical (confirmed)

The Design Brief's "suggested role, yours to finalize" table is superseded by the Design Handoff's actual, screen-tested token set. Locking the Handoff's assignments as final for both PRD and Design Brief:

- **Background:** `oklch(98% 0.003 90)` — warm near-white (not pure `#FFFFFF`).
- **Primary accent (CTAs, links, primary buttons):** `#7F53F3` violet/purple, with a `linear-gradient(135deg, #95048B, #7F53F3)` treatment on CTA buttons specifically.
- **Bright accent (drink-special badges, age-gate icon):** `#F814E8` magenta.
- **Success / live / positive indicator (not a primary CTA color):** `#25EFB8` teal/mint — used for the "LIVE" dot and positive badges, and `#0A9B71` (darker green) for success text/confirmations.

This reverses the Brief's suggestion that teal/mint be the primary CTA color and purple be tertiary — the Handoff's real screens use purple as primary and teal specifically for live/success states. Both PRD and Design Brief should be updated to reflect this as final, not "yours to finalize."

---

## Ready for Phase 0

With items 1–5 above and the two earlier confirmations (7-day team-seat invite expiry → REQ-ACC-041; Inter typeface), every item in the Technical Implementation Plan §3 and §4 is now resolved. Phase 0 can start without any further Product sign-off blocking it. No design follow-up is needed for promo codes (handled in Paddle, not NV) — the only remaining open point is a one-line engineering confirmation before Phase 5.5: verify Paddle's discount usage-limit feature can enforce the Founding Venue 50-cap on its own.
