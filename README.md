# Elec Simon — Booking Site

Single-page booking/landing site for Elec Simon, touring Event MC and percussion
entertainer (Orlando, FL). Built to convert corporate event planners and
wedding/venue bookers into inquiries.

Plain HTML, CSS and vanilla JS — no build step, no framework, no dependencies.
Three files do the whole job.

```
index.html      markup + content
styles.css      all styling (Cavaliers wine / gold / white on near-black)
script.js       reveals, form handling, video facade — ~200 lines, no libs
vercel.json     static hosting config + cache/security headers
assets/         image drop-in folder (see assets/README.md)
```

---

## Run locally

No build, no install. Either open `index.html` directly in a browser, or serve
it (needed if you want the form's `fetch` to behave exactly as in production):

```bash
python3 -m http.server 3000
# → http://localhost:3000
```

---

## One thing to wire up before launch

### 1. Formspree endpoint  ⚠️ required

The form will **not** submit until this is set. Create a form at
[formspree.io](https://formspree.io), copy the endpoint, and replace
`YOUR_FORM_ID` in `index.html`:

```html
<form id="booking-form" class="form"
      action="https://formspree.io/f/YOUR_FORM_ID"  <!-- ← here -->
      method="POST" novalidate>
```

Until you do, clicking submit shows a visible "Form not connected yet" warning
instead of a fake success message — deliberately, so a real inquiry can never be
silently dropped. After wiring it, submit a test inquiry and confirm the email
lands.

In Formspree, set the notification recipient to `booking@elecsimon.com`. The
form already includes a `_gotcha` honeypot for spam and a hidden
`Service Interest` field recording which service card the visitor clicked.

**Submitted fields:** Name, Email, Phone, Event Type, Event Date, Location,
Budget Range, Message, Service Interest.

### 2. Photos — already in place

All six image slots ship with real photos (see
[`assets/README.md`](assets/README.md) for what's where). To swap any of them,
replace the file at the same path using the same aspect ratio — no code
changes.

---

## Deploy to Vercel

The site is fully static, so Vercel needs no build settings.

**Option A — dashboard:** Import the repo at
[vercel.com/new](https://vercel.com/new). Framework Preset: **Other**. Leave
Build Command empty and Output Directory as the repo root. Deploy.

**Option B — CLI:**

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

### Point elecsimon.com at it

In the Vercel project → **Settings → Domains**, add `elecsimon.com` and
`www.elecsimon.com`, then update the DNS records at your registrar as Vercel
instructs (an `A` record to `76.76.21.21`, or a `CNAME` for `www`). HTTPS is
issued automatically.

After the domain is live, update the absolute URLs in `index.html` if the domain
ever differs from `elecsimon.com`: the `canonical` link, the `og:url` and
`og:image` tags, and the `url` in the JSON-LD block.

---

## Editing common things

| What | Where |
|---|---|
| Headline / subhead | `index.html`, `.hero` section |
| Hero photo | replace `assets/hero.jpg` (4:5). The hero is a split layout — copy left, photo right — so the headline never sits on top of the photo |
| "Trusted by" names | `index.html`, `.logos__list` — swap `<span>` for `<img>` when real logos arrive |
| Service card copy | `index.html`, `.cards` |
| YouTube video | `index.html`, `data-video-id` on `.video__facade` (also update the two thumbnail URLs in the same block) — see "Swapping the video" below |
| Short bio / full story | `index.html`, `#about` — long version lives in `#full-story` |
| Phone / email / socials | `index.html`, `.site-footer` |
| Colors | `styles.css`, `--wine` / `--gold` / `--red` in `:root` |

Every dropdown option, budget band and event type is plain HTML in the form —
edit the `<option>` tags directly.

### Swapping the video

The "See Elec Live" section currently plays the vertical Short
`j6hAGEO2YUQ`. To change it, edit the `.video__facade` block in `index.html`:

1. Set `data-video-id` to the new video's ID (for
   `youtube.com/shorts/ABC123` or `youtu.be/ABC123`, the ID is `ABC123` —
   drop any `?si=`/`?is=` share token).
2. Update the two thumbnail URLs in the same block to match the new ID.
3. **Vertical (Shorts):** keep the `video--vertical` class and use
   `oardefault.jpg` as the thumbnail — it's the full-height 1080×1920 frame.
   **Landscape (16:9 reel):** remove `video--vertical` and use
   `maxresdefault.jpg`. The frame resizes itself; no CSS changes needed.

---

## Notes on how it's built

- **Palette.** Cleveland Cavaliers colors — wine `#860038`, gold `#FDBB30`,
  white — on a near-black base. Wine is used structurally (section bands,
  glows, the "Trusted by" bar) and never for text, where it lacks contrast on
  dark; type is always gold or white.
- **Performance.** Zero JS dependencies. The YouTube player is a click-to-load
  facade (thumbnail only until pressed), so the page never ships an embed's
  worth of scripts on load. Fonts load from Google Fonts with `display=swap` and
  fall back to system sans-serif.
- **Mobile.** Single-column below 760px; cards go 1 → 2 → 3 across as the
  viewport grows. Tap targets are 44px+.
- **Accessibility.** Skip link, labelled fields, inline validation messages,
  visible focus rings, `prefers-reduced-motion` respected (fades and smooth
  scrolling are disabled).
- **Fails safe.** If JS doesn't run, all content is visible, the full story is
  expanded, and the form falls back to a native browser POST to Formspree.
- **Conversion touches.** Sticky header CTA, per-card "Inquire" buttons that
  scroll to the form and preselect the matching event type, and email/text
  fallbacks under the submit button.
