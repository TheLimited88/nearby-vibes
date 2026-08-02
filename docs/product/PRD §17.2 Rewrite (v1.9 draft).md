# §17.2 Post Performance Card — rewrite for PRD v1.9

**Status of the three items from last round:**
- Fixed trailing-7-day window (no selector) — confirmed correct, no change made.
- "Push Conversions" → "Push Sent vs Open" — standardized in the PRD text (§17.3, and now here in §17.2), and patched in the design source (v1.2 push-label-fix). **Update, July 24 (v1.4):** the label partially drifted back to "Push Conversions"/an inconsistent "Push Sent vs Opens" when the design moved to v1.4. Re-confirmed and locked as **Push Sent vs Opens** (plural — consistent with the day-by-day Issued/Opened breakdown in REQ-DASH-012), re-patched in `Analytics.dc.html` and `Posts.dc.html`. Corrected zip: **`Nearby Vibes - Design Hand Off v1.4 (push-label fix).zip`**, in your folder now. See §17.3's PM Decision note for the full history.
- §17.2 — rewritten below, replacing the old 7-field card with the same 8-metric pattern as §17.3, scoped to a single post. Continues the REQ-DASH numbering from §17.3.

---

## 17.2 Post Performance Card (venue-facing, per post)

This section previously specified a 7-field card (Views, Push Opens, Shares, Navigation Clicks, Confirmed Visits, Conversion Rate, and a combined Trend sparkline). `Posts.dc.html`'s Post Detail view (reached from the Active or Archived tab) replaces that with the same 8-tile grid pattern as the venue dashboard (§17.3), scoped to the individual post, each tile drilling into its own trend chart rather than one shared sparkline. The **Trend** field is retired as a standalone field — its role is now served by each tile's own detail chart.

REQ-DASH-009: The Post Performance Card shall present the same eight metric tiles, in the same fixed order, as REQ-DASH-001 (§17.3): Customer Attendance, Post Views vs Attendance, QR Scans, Nav Clicks, Push Sent vs Opens, Post Views, Followers, Post Shares — scoped to the individual post rather than the venue.

REQ-DASH-010: Per-post tile computations:

| Tile | Computation | Source |
|---|---|---|
| Customer Attendance | `count(arrival_confirmations)` where `post_id` = this post | `arrival_confirmations` (§14.2) |
| Post Views vs Attendance | Customer Attendance ÷ Post Views, shown as % | derived |
| QR Scans | `count(qr_scan events where post_id = this post)`, attributed per REQ-DASH-006 (venue's active-post window at scan time) | analytics event stream (§14.3) |
| Nav Clicks | `count(navigation_click)` where `post_id` = this post | analytics event stream |
| Push Sent vs Opens | `count(push_opened)` ÷ `count(push_sent)` for `push_events` whose `post_ids` array includes this post — a bundled push counts as sent/opened for every post it contained | `push_events` (§14.2) |
| Post Views | `count(post_impression)` where `post_id` = this post | analytics event stream |
| Followers | `count(follows)` where `source_post_id` = this post (REQ-DASH-007) | `follows` (§14.2) |
| Post Shares | `count(share)` where `post_id` = this post | analytics event stream |

REQ-DASH-011: Each tile opens a 7-day trend detail (REQ-DASH-002), except where the post's total active runtime is a single day, in which case the detail renders on an hourly axis instead (REQ-DASH-005).

REQ-DASH-012: The Push Sent vs Opens detail view shall additionally show a day-by-day table (Issued / Opened / %) alongside a grouped bar chart (Issued vs Opened per day) — richer than the standard single-series trend chart used by the other seven tiles.

REQ-DASH-013: The Nav Clicks detail view shall break clicks down by source screen — This Post vs Venue Profile — using `metadata.source_screen` (REQ-DASH-008).

Access: the Post Performance Card is subject to the same Trial/Premium gating as the venue dashboard (§17.3, REQ-SUB-007). A delegated team seat (REQ-ACC-039–040) sees this card only for posts they personally authored, consistent with the existing scoping rule.

---

## What this leaves clean

§17.2 and §17.3 now describe one consistent metric model (same 8 tiles, same names, same drill-down behavior) at two scopes — post and venue — with no remaining reference to the old headline-metric/5-visual-cap/Conversion-Rate/Trend-sparkline language anywhere in either section. §14.2's data model still needs the two real additions this uncovered (`follows.source_post_id`, and populating `qr_scan.post_id` in the event stream at write time) — those are tracked as REQ-DASH-006/007 in the §17.3 doc, not restated here.
