# Nearby Vibes — Technical Implementation Plan
Prepared: July 23, 2026 · Updated: July 24, 2026 · Based on: MVP PRD v1.8, Design Brief v1.8, Design Handoff.zip (27 screens), Additional Requirements (23 July), Implementation Roadmap (v1.3-based), Design Handoff v1.4 + `PRD Addendum — Design Handoff v1.4 (v1.9 draft continued).md`

## 1. Where things actually stand

Good news first: this project is unusually build-ready. You have a 87-page RFC-language PRD with traceable requirement IDs, a design-only companion brief, and a real design handoff — 27 high-fidelity HTML screen references plus a README with confirmed design tokens (Inter typeface, exact color hex values, an `oklch` warm-white background, component radii, and the signature decaying-timer-bar behavior). That's the "design hand-off" you mentioned, and it's genuinely complete: every screen in the PRD's UI spec has a corresponding file in the handoff.

The gap is that your one planning artifact — the **Implementation Roadmap** — is stamped **v1.3**, and the PRD has since gone to v1.8. Four capability areas were added after the roadmap was written and aren't sequenced anywhere:

- Subscription & Billing (14-day trial, Free/Premium, Paddle checkout, Founding Venue Program) — PRD §7.12, §21
- Expanded Admin Panel (MFA portal, full account management, NYC onboarding alerts, report queue) — PRD §7.8, §18
- Delegated Venue Seat / Team Seat Invite, later made Premium-gated — PRD §7.1, §10.15
- Trial & re-claim abuse prevention via Google Place ID — PRD §10.16

So "plan the build" mostly means: extend the phase plan to cover these four areas in the right dependency order, reconcile a few small design-vs-PRD discrepancies, and lock a few environment/stack decisions before any code gets written. None of this is a rewrite — it's four new phases slotted into an otherwise sound sequence, plus about five items that need one decision each before Claude starts coding.

## 2. Reconcile the roadmap: updated phase plan

The original Phases 0–9 (Foundation → Auth/Onboarding → Post Lifecycle → Discovery → Follow/Scoring → Push → QR/Geofence → Analytics → Security/SEO → Launch) are still structurally correct and should stay. Insert four phases as follows, preserving the existing dependency graph:

**Phase 1.5 — Admin Foundation (new)**
Depends on: Phase 1 (needs `users`/`venues` tables and RBAC pattern established).
Build: separate `admin_users` auth path with mandatory TOTP MFA, non-public portal URL provisioned as a secret, Cloudflare Turnstile/stricter rate limiting on admin endpoints, `admin_audit_log`. This is pulled early — ahead of Phase 2 — because every later phase's "Admin can view/edit/delete X" requirement (posts in Phase 2, venues in Phase 1, subscriptions in the new Phase 5.5) depends on this auth scaffold existing first. Building it last (as a bolt-on "Phase 8" item) would mean retrofitting admin-scoped endpoints across four earlier phases instead of adding them as each resource is built.
Exit criteria: PRD §8.14 points 1 and 5 (login lockout behavior, audit logging) pass in isolation, before any manageable resources exist yet.

**Phase 2.5 — Delegated Venue Seat (new)**
Depends on: Phase 1 (venue accounts), Phase 2 (posts, since seat permissions are post-scoped).
Build: `venue_staff` table, GitHub-style email invite with role-type (Venue Team Member / Social Content Creator) + custom title, one-seat-per-venue enforcement, scoped post CRUD, scoped dashboard view (built out fully in Phase 7 but the RBAC boundary belongs here).
Note the sequencing dependency this creates for Phase 7: the seat's dashboard view can't be finished until Phase 7 exists, so land the RBAC/data model here and the dashboard rendering in Phase 7.

**Phase 5.5 — Subscription & Billing (new)**
Depends on: Phase 1 (venue claim triggers trial start), Phase 1.5 (admin needs to view subscription state per REQ-ADMIN-015).
Build: `subscriptions`, `promo_codes`, `subscription_events` tables; trial-start-on-claim; Paddle checkout integration with the 5%+$0.50 platform fee calculation; webhook signature verification; the three scheduled jobs (trial-expiry sweep, renewal-reminder sweep, past-due grace sweep); Founding Venue Program with race-condition-safe cap enforcement (PRD §21.4 — increment on webhook confirmation, not checkout-session creation); subscription-lifecycle push/email notifications (PRD §15.9).
This phase should land **before** Phase 2.5's seat-gating logic goes live, since REQ-ACC-039 blocks seat invites on the Free plan — the subscription state needs to exist first. Practically: build Phase 2.5's data model and CRUD first, then Phase 5.5, then wire the Premium-gate check into Phase 2.5's invite endpoint as a final step.
Exit criteria: PRD §8.13, all six points — this is the most acceptance-criteria-dense of the four new phases and should not be considered done until the concurrent-checkout race condition (§21.4) has an actual test, not just a code review.

**Phase 6.5 — Trial & Re-claim Abuse Prevention (new)**
Depends on: Phase 1 (venue claim flow), Phase 5.5 (trial state).
Build: the persistent `place_claim_ledger` table (survives venue deletion — this is the one schema element that must NOT hang off the `venues` row), the 90-day re-claim cooldown check, the one-trial-per-Place-ID-ever check, Admin cooldown-override action, fraud-queue flagging distinct from the existing duplicate-claim rejection.
This is small in scope but easy to build wrong if sequenced late — if `place_claim_ledger` isn't in place before real venues start getting claimed/deleted in QA, you lose the ability to test the cooldown path realistically. Build it alongside Phase 1, even though full billing integration (Phase 5.5) needs to exist first for the "lands directly on Free plan" behavior to be testable end-to-end.

Updated dependency chain (additions only):
```
Phase 1 --> Phase 1.5 (Admin Foundation)
Phase 1 --> Phase 6.5 (Trial/Re-claim Abuse) --> depends on Phase 5.5 for full E2E test
Phase 1 --> Phase 2 --> Phase 2.5 (Delegated Seat data model)
Phase 1 --> Phase 1.5 --> Phase 5.5 (Subscription & Billing)
Phase 5.5 --> Phase 2.5 (Premium-gate wiring, final step)
Phase 5.5 --> Phase 6.5 (full E2E)
Phase 1.5, 2.5, 5.5, 6.5 --> Phase 7 (Analytics & Dashboards) -- all four feed dashboard/admin-console surfaces
Phase 7 --> Phase 8 (Security/SEO Hardening) -- now also covers admin-portal and checkout-flow WCAG audit
Phase 8 --> Phase 9 (Launch) -- load test must now include the Paddle-checkout-burst and trial-expiry-batch scenarios per PRD §19.6
```

Phase 8 and 9's exit criteria also need updating: Phase 8's WCAG audit must cover the checkout flow and admin portal (PRD §9.15 says so explicitly), and Phase 9's load test must include "a simulated trial-expiry batch job run and a burst of concurrent Paddle checkout sessions" (PRD §19.6) — the original roadmap's load-test description predates this requirement.

## 3. Design-to-code reconciliation (do this before Phase 1 UI work starts)

The design handoff is high-fidelity and the README is unambiguous that it should be treated as a build target, not just inspiration. Three small discrepancies exist between the handoff and the PRD/Design Brief that are worth resolving up front rather than mid-build:

1. **Background color.** Handoff specifies `oklch(98% 0.003 90)` (warm near-white) as the app canvas; the PRD/Design Brief only confirm pure `#FFFFFF`. Minor, but pick one — it affects every screen. Still open (folded into decision 5 in §4, since it's part of the same color-role reconciliation).
2. **Typography — confirmed, July 24.** Inter (weights 500/600/700/800, the handoff's scale) is locked as the typeface spec for both PRD and Design Brief, which previously specified none.
3. **Team seat invite expiry — confirmed, July 24.** 7 days is correct. Tracked as **REQ-ACC-041**: a Team Seat invite not accepted within 7 days of being sent shall expire and require the venue owner to re-send it. Add to §7.1/§10.15 alongside REQ-ACC-030–038.
4. **Content Guidelines sheet (new in v1.4, not yet in PRD).** `Post Creation Wizard.dc.html` now links out to a Content Guidelines summary sheet, matching the new `Claude Content Policy for NV v1.1.pdf`. Tracked as REQ-POST-033 in the v1.4 addendum — needs to land in §9.6/§10.9 before Phase 2 (Post Lifecycle) UI work, since it's part of the wizard flow itself.
5. **"Push Sent vs Opens" (plural) is the locked label, replacing both "Push Conversions" and singular "Push Sent vs Open."** v1.4 had briefly drifted `Analytics.dc.html` back to "Push Conversions" and mismatched `Posts.dc.html`; re-patched and confirmed. Build Phase 7 against **Push Sent vs Opens** at venue (§17.3), post (§17.2), and network (§17.4, REQ-DASH-014) scope — use the corrected `Nearby Vibes - Design Hand Off v1.4 (push-label fix).zip`, not the plain v1.4 zip.
6. **Network Dashboard push funnel restructured — additive, not a replacement.** v1.4 replaces the 4-stage Sent/Delivered/Opened/Clicked funnel with a 7-day Push Sent vs Opens grouped bar chart (REQ-DASH-014), matching the venue/post-level pattern. Confirmed this sits alongside, not instead of, the existing "push open rates by area/neighborhood" metric in §17.4 — that metric isn't currently shown in any design file (a design-coverage gap to flag to design, not a spec question) but stays in scope for Phase 7.

None of these block starting the build, but resolving them now avoids a rework cycle when the design and PRD are read by different people (or different Claude sessions) during implementation. Phase 7 (Analytics & Dashboards) should build against the corrected v1.4 push-label-fix zip and REQ-DASH-001 through REQ-DASH-014 as now finalized in the §17.2/§17.3 rewrite drafts and the v1.4 addendum.

## 4. Decisions locked before Phase 0 — confirmed July 24

All five, plus the related trial-start-trigger sub-item, are now decided. Full detail in **`PRD Decisions — Phase 0 Sign-off (July 24).md`**; summary:

- **Repo structure:** monorepo (Next.js frontend + NestJS backend, shared types package).
- **Grace window:** 3 days, locked as final (not provisional).
- **Founding Venue Program vs. Promo Code:** confirmed as one shared mechanism, single "Promo Code" field at checkout. All promo codes (Founding Venue and discretionary) are created and managed directly in the **Paddle dashboard**, not an NV admin screen — no new Admin Portal screen needed. NV's job is limited to passing the code through at checkout and reading the applied discount back from Paddle's webhook. The Founding Venue 50-cap should be enforced via a Paddle coupon usage limit rather than NV's own atomic counter (§21.4) — verify Paddle supports this before Phase 5.5. Also resolves Appendix A item 6(b): trial start now anchors to **venue profile setup completion** (not bare claim completion) — amends REQ-SUB-001.
- **Admin portal:** confirmed as already specified (non-guessable secret path, email+password+TOTP, Cloudflare Turnstile/Bot Management). No spec change — just generate and store the path as a secret before Phase 1.5.
- **Color roles:** Design Handoff's palette is canonical — purple (`#7F53F3`) primary/CTA, teal (`#25EFB8`) reserved for live/success indicators, warm off-white background (`oklch(98% 0.003 90)`). Supersedes the Design Brief's "yours to finalize" suggestion of teal-as-primary.

## 5. Recommended kickoff sequence

1. ~~Resolve the five decisions in §4~~ — done, see above and the sign-off doc.
2. Reconcile the remaining design/PRD discrepancy in §3 (background color is now resolved via decision 5 above; nothing else outstanding).
3. Hand Claude Code (or whichever agent does the build) the full document set together: PRD v1.8, Design Brief v1.8, this plan, the two §17.2/§17.3 rewrite drafts, the v1.4 design addendum, the Phase 0 sign-off doc, and the Design Handoff v1.4 (push-label fix).zip extracted alongside them. Ask it to confirm the phase plan (including the four new phases) before writing code.
4. Execute Phase 0 → 1.5 → 2 → 2.5 → 5.5 → 6.5 → 3 → 4 → 5 → 6 → 7 → 8 → 9, instrumenting analytics events incrementally as each phase ships (not retroactively in Phase 7).
5. Before Phase 5.5 specifically: confirm Paddle's discount usage-limit feature can enforce the Founding Venue 50-cap on its own — the one open item that isn't a Phase 0 blocker but affects how much custom concurrency logic Phase 5.5 needs to build.

## 6. What "done planning" looks like

Done. All decisions in §4 are made, all reconciliation items in §3 are resolved, and the full document set (PRD v1.8, Design Brief v1.8, this plan, the v1.9-draft rewrites, the v1.4 addendum, and the Phase 0 sign-off doc) is ready to hand to whoever's doing the build. Phase 0 can start today. The only outstanding item — confirming Paddle's coupon usage-limit behavior — is scoped to land before Phase 5.5, not before Phase 0.
