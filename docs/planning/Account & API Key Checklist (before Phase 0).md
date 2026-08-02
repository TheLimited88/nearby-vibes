# Account & API key checklist — before Phase 0

Pulled directly from the confirmed stack in PRD §20.1 ("Final MVP stack") — not a guess, this is what the PRD already locked in. Create these accounts yourself; hand the resulting keys/tokens to Claude Code as environment variables when you kick off the build. Nothing here needs to be given to me.

---

## Required before Phase 0 (blocks the build from starting)

**1. Domain registrar** — register your production domain (e.g. `nearbyvibes.com`). You'll need it configured with four hostnames per §20.2: the main app, `cdn.`/`media.` for object storage delivery, `api.` for the backend, and a fourth non-public path/subdomain for the admin portal (generate this value yourself — don't tell Claude Code to invent something guessable, and don't put the literal value in any doc, chat, or repo commit — store it in your password manager and pass it to Claude Code as a secret directly).

**2. Vercel** — hosts the Next.js frontend (`nearbyvibes.com`). Free tier is fine to start. Grab a deploy token once the project exists, or just connect it to GitHub directly and let Vercel auto-deploy on push (simplest option — no key needed if you do it this way).

**3. DigitalOcean** — hosts the NestJS backend (`api.nearbyvibes.com`) and the Managed PostgreSQL database (PostGIS extension enabled — DO's managed Postgres supports this, just needs turning on). You'll need: an API token for Claude Code to provision resources, and the database connection string once the DB is created.

**4. Cloudflare** — sits in front of everything: CDN/edge caching, DDoS/WAF, Turnstile (bot protection on login/signup/admin), and Bot Management. Also the natural place to point your domain's DNS. Two things to grab: a Turnstile site key + secret key (create a Turnstile widget in the dashboard), and an API token if you want Claude Code to manage DNS/CDN config directly.

**5. Cloudflare R2** — object storage for all post/venue images and video (this is the PRD's primary pick over DigitalOcean Spaces). Same Cloudflare account as above — just enable R2 and create a bucket, then grab an R2 access key + secret.

**6. Firebase (Google)** — one Firebase project covers two things the PRD requires: **Firebase Auth** (all consumer/venue login, including built-in email verification and password-reset emails — no separate email vendor needed) and **Firebase Cloud Messaging** (push notifications to the installed PWA). Create the project in the Firebase console, then grab the web app config object (API key, project ID, etc.) and a service-account JSON key for backend-side auth/push calls.

**7. Google Cloud — Places API** — separate from Firebase in one way: Places API needs billing enabled on the underlying Google Cloud project (it's a paid API past a free monthly quota) even though you can technically create it inside the same GCP project Firebase uses. Enable "Places API" in Google Cloud Console, attach a billing account, and generate an API key restricted to Places API only.

**8. Paddle.com** — payments, as Merchant of Record (handles tax/compliance for you). Create a sandbox account first for development/testing, a live account before launch. Grab: API key, webhook signing secret (for verifying subscription lifecycle webhooks), and set up the Founding Venue coupon (50% off, 50-use cap — confirm Paddle's per-coupon usage-limit feature covers this before Phase 5.5, per the open item in the implementation plan).

**9. Mapbox** — you're already handling this one. Just need the access token (public token is fine for GL JS rendering) handed to Claude Code same as the rest.

---

## Not required for Phase 0, worth knowing about

**Metabase** — the PRD lists this for internal BI/dashboards (§20.1), separate from the venue/admin analytics screens that get built into the actual product. This is an internal tool for you/your team to query the database directly, not something end users touch — skip setting this up until you actually want to look at raw data outside the built-in dashboards. Free self-hosted, or a paid cloud tier if you'd rather not run it yourself.

---

## What to do with all of this

Once you've got the accounts, gather the resulting values (API keys, tokens, secrets, the admin portal path) into one place — a password manager entry or a local `.env` file you keep out of git — and hand them to Claude Code directly when you start the Phase 0 session, e.g. as environment variables it writes into `.env.local`/`.env` files that are already `.gitignore`'d. Don't paste secrets into chat with me or into any of the planning docs — those are meant to be committed to the repo and read by anyone on the team.
