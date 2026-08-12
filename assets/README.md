# Image assets

Drop files here with these **exact filenames** and the placeholders on the site
disappear automatically — no code changes needed. Until a file exists, the page
shows a labelled dashed placeholder at the correct size.

| Filename | Size | Aspect | Where it appears | Notes |
|---|---|---|---|---|
| `hero.jpg` | 2400 × 1350 | 16:9 | Full-bleed hero background | Action shot. Keep the subject **right of center** — the headline sits on the left. A dark scrim is applied automatically, so a bright, high-contrast photo works best. |
| `card-corporate.jpg` | 1200 × 900 | 4:3 | Service card 1 | Elec on mic, stage or conference ballroom. |
| `card-percussion.jpg` | 1200 × 900 | 4:3 | Service card 2 | Elec + DJ/drummer, mid-performance. |
| `card-schools.jpg` | 1200 × 900 | 4:3 | Service card 3 | Bucket-drumming assembly with kids playing along. |
| `about.jpg` | 1200 × 1500 | 4:5 portrait | Story section | Portrait or vertical action shot. |
| `og-image.jpg` | 1200 × 630 | 1.91:1 | Social share preview | Include Elec + his name; this is what shows in texts, Slack, LinkedIn. |

## Optional: hero video loop

For a moving hero, add `hero-loop.mp4` (silent, 6–12s, H.264, ideally under
3 MB) and swap the `<img>` in the hero for the commented-out `<video>` block
already in `index.html`. Keep `hero.jpg` in place — it's used as the poster
frame while the video loads and on devices that skip autoplay.

## Logos

Real client logos go in `assets/logos/`. Use white or light SVGs (they sit on a
dark bar), then replace each `<span class="logo-badge">` in the "Trusted by"
strip with `<img src="assets/logos/zillow.svg" alt="Zillow" height="28">`.

## Before uploading

Compress everything — [Squoosh](https://squoosh.app) at ~75% quality is plenty.
Aim for under 400 KB for the hero and under 150 KB for the rest.
