# Addendum: Post & Venue Performance Analytics

Adds to the original handoff (`README.md`). Covers the post-lifecycle management screen (`Nearby Vibes - Posts.dc.html`) and venue analytics dashboard (`Nearby Vibes - Analytics.dc.html`), finalized this session.

## What's new

**Posts.dc.html**
- Active / Scheduled / Drafts / Archive tabs, each with a **single shared action bar at the top of the list** (Edit / Duplicate / End Early-Cancel-Delete), not per-row buttons. Rows show a selection indicator (filled/empty circle); tapping a row selects it and the top action bar acts on the current selection.
- Active tab has an empty state (icon-free, teal "Create Post" CTA with a bolt icon) when no posts are live.
- Post Detail screen (from Active or Archive) has a **Post Performance** section: 8 metric tiles in the same order/style as venue-level Analytics — Customer Attendance, Conversion Rate (renamed **"Post Views vs Attendance"**), QR Scans, Nav Clicks, Push Conversions (renamed **"Push Sent vs Open"**), Post Views, Followers, Post Shares. Each tile drills into its own detail screen (examples 7–14) with a 7-day bar chart.
- **Day-of-week labels**: multi-day charts use compact `1 Mon`, `2 Tue`, … `7 Sun` labels (not spelled-out "Day 1 Mon"). Chart bar containers and label rows share identical `padding`/`gap` so columns and labels line up exactly — replicate this pairing in code (label row is not simply `justify-content: space-between`).
- **Single-day posts**: when a post only ran one day, its detail chart switches to an hourly axis (5PM–9PM style) instead of a 7-day axis — see example #15 (Post Views, single-day variant) for the reference pattern. This behavior needs to be wired to real post duration data.
- Push Conversions detail shows a day-by-day table (Issued / Opened / %) plus a grouped bar chart (Issued vs Opened) above it.
- Nav Clicks detail includes a "Source of Nav Clicks" breakdown (This Post vs Venue Profile).

**Analytics.dc.html (venue-level)**
- Tile grid and drill-downs already existed and now match the Posts-level pattern: renamed "Conversion Rate" → **"Post Views vs Attendance"** (tile + screen title + example-badge caption, 3 places).
- Copy synced with Posts-level narrative, adapted to venue scope ("your posts" / "your venue" instead of "this post") across Customer Attendance, Conversion Rate, QR Scans, Nav Clicks, Post Shares, Push Conversions.
- Redundant subtext lines removed (e.g. "· last 7 days" duplicated info already on the stat card); "Total Posts" tile restored next to "Total Views" (relevant at venue level, unlike at the single-post level where it was removed).
- QR Scans and Push Conversions detail screens: day/date counts folded directly onto each chart bar (e.g. "45 / 22" for sent/opened) instead of a separate list underneath — the separate lists were removed.
- Day-of-week label format (`1 Mon`, `2 Tue`, …) and label/bar alignment fix applied to all charts from screen #3 onward, same treatment as Posts.dc.html.

## Data model implications for engineering
- Post record needs a computed **run length in days** (1–7+) to decide hourly-vs-daily chart mode on the client.
- Nav Clicks needs a **source** dimension (post vs venue profile) per event.
- Push notification events need **sent** and **opened** counts, bucketed by day, per post and rolled up per venue.
- QR scan events need day-bucketed counts per post and rolled up per venue.

## Not yet done / open items
- The 4 new post-level metric detail screens (Nav Clicks, Push Conversions, Followers, Post Shares — examples #11–14) are appended after the original 4 (#7–10) rather than fully reordered to match the tile grid's left-to-right order (Customer Attendance → Conversion Rate → QR Scans → Nav Clicks → Push Conversions → Post Views → Followers → Post Shares). Cosmetic only — reorder the example slides if exact sequencing matters for engineering readability.
