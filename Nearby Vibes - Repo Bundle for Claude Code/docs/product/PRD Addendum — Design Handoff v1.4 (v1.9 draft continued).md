# PRD addendum — Design Handoff v1.4 (v1.9 draft, continued)

**Source of truth for this addendum:** `Nearby Vibes - Design Hand Off v1.4.zip`, diffed against `Design Handoff V1.3 (push-label fix).zip`. Six screens changed: `Admin Account Management`, `Admin Onboarding Queue`, `Analytics`, `Network Dashboard`, `Post Creation Wizard`, `Posts`. `README.md` and `ADDENDUM_post_venue_analytics.md` inside the v1.4 bundle were **not** updated to reflect these changes — this doc fills that gap. Continues the REQ-DASH numbering from the §17.2/§17.3 rewrite drafts already in this folder.

---

## 1. New requirement — Content Guidelines sheet in Post Creation Wizard (§9.6)

`Post Creation Wizard.dc.html` adds a "Keep it real — see our Content Guidelines" link and a linked slide-up sheet (Do / Don't summary + liability line + "Got It" dismiss). This isn't in PRD v1.8 anywhere — §9.6 currently has no content-policy touchpoint, and §10.9 (Content moderation) doesn't reference a venue-facing guidelines surface.

The sheet's copy matches `Claude Content Policy for NV v1.1.pdf`, which is new in this folder as of today.

**REQ-POST-033 (new):** The Post Creation Wizard shall display a "Content Guidelines" entry point (linked text, placed per the design near the Step 2 core-fields area) that opens a slide-up sheet summarizing the venue content policy: core principle line, a "Do" example, a "Don't" example, and a liability/responsibility line, with a single "Got It" dismissal. Full policy text lives in the Content Guidelines document (`Claude Content Policy for NV v1.1.pdf`); this sheet is a summary, not the full text.

**§10.9 cross-reference (edit):** add a pointer from Content moderation to this document as the canonical venue-facing content policy, and to REQ-POST-033 as its in-product surface.

---

## 2. Resolved — locked on "Push Sent vs Opens" (plural)

The §17.2/§17.3 rewrite drafts had standardized on "Push Sent vs Open"; v1.4 partially reverted that (`Analytics.dc.html` back to "Push Conversions" in 3 places, `Posts.dc.html` picked up a stray "Push Sent vs Opens").

**Decision:** the plural, more granular form — **Push Sent vs Opens** — is correct, consistent with the day-by-day Issued/Opened breakdown already shown in the detail view (REQ-DASH-012). Locked at both venue (§17.3, REQ-DASH-001/003) and post scope (§17.2, REQ-DASH-009/010/012).

Re-patched in the design source: **`Nearby Vibes - Design Hand Off v1.4 (push-label fix).zip`** (in your folder) — same content as v1.4, only the 4 label instances across `Analytics.dc.html` and `Posts.dc.html` changed to "Push Sent vs Opens." No other screen touched.

---

## 3. Resolved — Network Dashboard push chart is additive, not a replacement (§17.4)

`Network Dashboard.dc.html`'s push notification chart changed from a single 4-stage funnel (Sent → Delivered → Opened → Clicked) to a 7-day grouped bar chart (Sent vs. Opened per day, `1 Mon … 7 Sun` day labels) — the same day-bucketed, two-stage pattern REQ-DASH-001/003 already define at venue and post level. "Delivered" and "Clicked" are dropped from this particular chart.

**Decision:** this is a distinct, additive metric — platform-wide "are pushes being opened" (business-critical, time-bucketed) is a different question from the existing geographic "push open rates by area/neighborhood" cut, which stays in §17.4 as its own line item even though it isn't visible in the current design files (design coverage gap, not a spec gap — the requirement itself isn't in question). Both are locked into §17.4's Push health group. Metrics here are expected to keep evolving in future iterations; this is the right MVP baseline, not a final state.

**REQ-DASH-014 (locked):** The Network (Admin platform) dashboard's Push health group shall include a 7-day Push Sent vs Opens grouped bar chart, day-labeled per REQ-DASH-002, aggregated platform-wide — in addition to, not in place of, the existing area/neighborhood open-rate metric.

---

## 4. Resolved, no PRD change needed — Fraud Queue nav item now visible

`Admin Account Management.dc.html` and `Admin Onboarding Queue.dc.html` both now show a "Fraud Queue" entry in the sidebar nav. This is already fully specified (REQ-ONB-025, §10.5, route `/admin/venues/fraudqueue`) — the design previously just didn't render the nav item. No PRD edit needed; noting it here so the implementation plan's admin-portal work can treat this as confirmed rather than outstanding.

---

## Flagged, not yet done

- v1.4's `README.md`/`ADDENDUM_post_venue_analytics.md` still don't mention any v1.4 changes (Content Guidelines sheet, Push Sent vs Opens fix, Network Dashboard chart, Fraud Queue nav) — worth a changelog pass next time design touches this bundle, same as the v1.9 changelog line suggested in the §17.3 rewrite.
- §14.2 data model additions from the §17.2/§17.3 rewrites (`follows.source_post_id`, `qr_scan.post_id` population) are still outstanding — unchanged by this addendum, just restating so they don't get lost.
