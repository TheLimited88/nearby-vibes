# §17.3 Venue dashboard — rewrite for PRD v1.9

**Source of truth for this rewrite:** Design Handoff v1.2 (`Analytics.dc.html`, `Posts.dc.html`, and `ADDENDUM_post_venue_analytics.md`). Per design's own account, the original "one headline metric + 5 capped visuals" model under-served venue owners once real screens were built out — the metric set was widened to give better customer insight. This rewrite treats that as an intentional scope increase, not a drift to reconcile away.

**What changes from the current §17.3:** the "5 visuals max, per source brief's explicit cap" model — a single oversized "Customers Brought In" headline metric plus five supporting charts, with the Post Performance Card counted as the fifth — is replaced by an 8-metric grid used consistently at both the venue level (this section) and the per-post level (§17.2, flagged below for a matching follow-up rewrite). Every tile is independently tappable into its own trend detail. Nothing about *access gating* (Trial/Premium requirement, Free-plan prompt, delegated-seat scoping) changes — only the metric surface itself.

Suggested changelog line for §0 (How to Read This Document): *"Version 1.9 changelog: Product replaced the fixed 'headline metric + 5 visuals' venue dashboard model (§17.3) with an 8-metric grid, based on findings from visual design execution (Design Handoff v1.2) — the narrower model under-represented the data venue owners needed to see. Post-level parity tracked separately against §17.2."*

---

## 17.3 Venue dashboard (8-metric grid — supersedes prior 5-visual cap)

REQ-DASH-001: The venue dashboard shall present exactly eight metric tiles, in the following fixed order, for the trailing 7-day period: Customer Attendance, Post Views vs Attendance, QR Scans, Nav Clicks, Push Sent vs Opens, Post Views, Followers, Post Shares.

REQ-DASH-002: Each tile shall be independently selectable and shall open a detail view showing a 7-day trend chart for that metric, day-labeled in compact form (`1 Mon`, `2 Tue`, … `7 Sun`).

REQ-DASH-003: Tile computations, at venue scope (aggregated across the venue's posts for the period):

| Tile | Computation | Source |
|---|---|---|
| Customer Attendance | `count(arrival_confirmations)` where `venue_id` = venue, `confirmed_at` in period | `arrival_confirmations` (§14.2) |
| Post Views vs Attendance | Customer Attendance ÷ Post Views, shown as % | derived |
| QR Scans | `count(analytics events where event_type = qr_scan)` for the venue in period | analytics event stream (§14.3) — see REQ-DASH-006 |
| Nav Clicks | `count(navigation_click)` for the venue in period | analytics event stream |
| Push Sent vs Opens | `count(push_opened)` ÷ `count(push_sent)` for pushes referencing the venue's posts, shown as % | `push_events` (§14.2) |
| Post Views | `count(post_impression)` for the venue in period | analytics event stream |
| Followers | net new `follows` rows (state = trial or hard) created against the venue in period | `follows` (§14.2) |
| Post Shares | `count(share)` for the venue in period | analytics event stream |

REQ-DASH-004: The dashboard shall include a "Top Performing Posts" list ranked by the period's top posts, showing each post's name, QR scan count, and Post Views vs Attendance conversion rate, with a link into that post's own detail (§17.2).

REQ-DASH-005: A post whose total active runtime is a single day shall render its detail-chart drill-downs on an hourly axis (matching its live window, e.g. 5PM–9PM) rather than the standard 7-day axis. This applies at both post level (§17.2) and wherever a venue-level chart is scoped to a single post.

REQ-DASH-006 (new data-model dependency): `qr_scans` (§14.2) has no `post_id` column — the universal QR code resolves to a venue, not a post. Per-post/per-venue QR Scans attribution shall rely on the existing one-active-post-per-venue rule (§10.3): a scan's `resolved_venue_id` combined with `scanned_at` falling inside that venue's currently-active post's `[start_at, end_at]` window unambiguously attributes the scan. The analytics event stream's `qr_scan` event type (§14.3) already carries a nullable `post_id` — it shall be populated at write time using this rule rather than left null.

REQ-DASH-007 (new data-model dependency): `follows` (§14.2) has no attribution back to a triggering post, but the Followers tile is scoped per-post in §17.2. Add `follows.source_post_id` (`uuid`, nullable — null for follows not attributable to a specific post, e.g. organic profile visits) to support this. Venue-level Followers (this section) sums across all posts plus unattributed follows; post-level Followers (§17.2) filters to `source_post_id` = the post.

REQ-DASH-008: `navigation_click` events shall populate `metadata.source_screen` as `enum(post_detail, venue_profile)` (the existing free-form `metadata` jsonb column already supports this — no schema change, just a now-required value for this event type) to support the Nav Clicks detail view's "Source of Nav Clicks" breakdown.

Access gating (unchanged from prior §17.3): the full dashboard is available only while the venue's subscription is Trial or Premium (REQ-SUB-007, §17.5); on lapse to Free, the route renders the upgrade prompt described in the Design Brief's Venue dashboard section rather than the metric grid. Delegated team-seat view (REQ-ACC-039–040, REQ-ACC-033–034, REQ-SUB-020): a venue's invited team member/content creator sees the same 8-metric venue-level grid the owner sees, plus their own Post Performance detail (§17.2) scoped to posts they personally authored; billing/subscription screens remain owner-only; this view is suspended (not removed) if the venue lapses to Free and restores automatically on return to Premium.

> **PM Decision:** the design shows a static "Last 7 days" label with no visible period selector (day/week/month toggle). This rewrite specs the dashboard as a fixed trailing-7-day window for MVP, consistent with the rest of the design's "calm, not an analytics-tool wall of charts" intent. If a selectable window is actually intended, that's a design clarification needed before this is locked, not an engineering guess.

> **PM Decision (updated July 24, v1.4):** this label round-tripped. Design Handoff v1.2 (push-label-fix) corrected both screens to "Push Sent vs Open"; v1.4 partially reverted it — `Analytics.dc.html` went back to "Push Conversions" (3 instances) and `Posts.dc.html` picked up a mismatched "Push Sent vs Opens." You confirmed the intended label is the more granular, plural form — **Push Sent vs Opens** — to read consistently with the day-by-day Issued/Opened breakdown in REQ-DASH-012. This is now locked as the correct label at both venue and post scope (§17.2). Corrected zip: **`Nearby Vibes - Design Hand Off v1.4 (push-label fix).zip`**, in your folder — same content as v1.4, only the four "Push Conversions"/"Push Sent vs Open" instances in `Analytics.dc.html` and `Posts.dc.html` changed to "Push Sent vs Opens." No other screen touched.

---

## Flagged, not yet done

**§17.2 (Post Performance Card) needs a matching rewrite.** The current §17.2 still describes the old 7-field card (Views, Push Opens, Shares, Navigation Clicks, Confirmed Visits, Conversion Rate, Trend/sparkline) — it hasn't been updated to the same 8-tile-with-drill-down pattern `Posts.dc.html` now actually shows for an individual post. Since §17.3 above references §17.2 for the post-level version of this same metric set, leaving §17.2 stale will read as inconsistent the moment someone reads both sections together. You didn't ask me to touch it this round — flagging it as the natural next edit once you're ready.

**§14.2 data model** needs REQ-DASH-006/007/008 above actually reflected as table changes (the `follows.source_post_id` column in particular is a real, previously-unidentified schema addition, not just a documentation update).
