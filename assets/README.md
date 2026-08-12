# Image assets

All six slots are **filled with real photos**. To change any of them, replace
the file at the same path with the same aspect ratio — no code changes needed.
If a file is ever missing, the site falls back to a labelled placeholder
showing the expected filename and size, so nothing silently breaks.

| Filename | Size | Aspect | Currently showing | Where it appears |
|---|---|---|---|---|
| `hero.jpg` | 900 × 1125 | 4:5 | Elec on mic, outdoor stage | Hero photo panel (right side on desktop) |
| `card-corporate.jpg` | 1200 × 900 | 4:3 | Studio portrait, smiling | Service card 1 — Corporate & Conference MC |
| `card-percussion.jpg` | 1200 × 900 | 4:3 | Congas under stage lighting | Service card 2 — Live Percussion + DJ |
| `card-schools.jpg` | 1200 × 900 | 4:3 | Drumming close-up, Cavaliers game | Service card 3 — School Anti-Bullying Assembly |
| `about.jpg` | 1160 × 1450 | 4:5 | Bucket drumming on the Cavaliers court | Story section |
| `og-image.jpg` | 1200 × 630 | 1.91:1 | Elec on mic (wide crop) | Social share preview (texts, Slack, LinkedIn) |

## Worth swapping when you have the shot

`card-schools.jpg` is currently a Cavaliers-branded drumming photo standing in
for the school assembly card. A photo of an actual assembly — kids on buckets,
full band, school gym — would sell that service far harder. Same filename,
same 4:3 ratio, and it drops straight in.

## Optional: hero video loop

For a moving hero, add `hero-loop.mp4` (silent, 6–12s, H.264, ideally under
3 MB) and swap the `<img>` in the hero for the commented-out `<video>` block
already in `index.html`. Keep `hero.jpg` in place — it's the poster frame while
the video loads and on devices that skip autoplay.

## Logos

Real client logos go in `assets/logos/`. Use white or light SVGs (they sit on a
wine bar), then replace each `<span class="logo-badge">` in the "Trusted by"
strip with `<img src="assets/logos/zillow.svg" alt="Zillow" height="28">`.

## Before uploading replacements

Compress everything — [Squoosh](https://squoosh.app) at ~80% quality is plenty.
Aim for under 300 KB each. The current files run 98–279 KB.
