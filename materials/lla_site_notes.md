# LLA site notes — brand, fonts, footage, blogs, references

Sources: crawled copies of https://www.longevitylifeacademy.com/ in `/workspace/lla/home.html`, `pd_home.html`, `pd_pricing.html`, and `/workspace/lla/pages/*` (crawled 17 Nov 2026, Asia/Jerusalem), plus live HEAD/GET checks the same evening. Asset host used by the production site: `https://longevitylifeacademy.pages.dev`.

This certificate landing page should match this design standard (and French Atelier / Masterclass press, below), but the **content market is different**: a professional instructor / adviser certificate, not the consumer 18-week protocol course.

---

## Brand colors (CSS custom properties from the homepage)

Core tokens from `:root` / homepage CSS:

| Token | Value |
| --- | --- |
| `--blue` / `--royal` / `--card-accent` / `--tc-accent` / `--hc-top` | `#3D6394` |
| `--blue-strong` | `#314C77` |
| `--blue-hover` | `#33527D` |
| `--blue-light` / `--skytint` | `#E8F1FF` |
| `--ink` | `#111111` |
| `--ink-2` | `#2A2F36` |
| `--ink-3` | `#5A6472` |
| `--ink-4` | `#8892A0` |
| `--bg` | `#FFFFFF` |
| `--surface` | `#F5F7FA` |
| `--surface-2` / `--surface2` | `#EEF1F6` |
| `--navy-ink` | `#040D24` |
| `--v7-td` | `#0A1E3A` |
| `--v7-md` | `#3E5A7C` |
| `--v7-ice` | `#EEF4FC` |
| `--phase-1` | `#6FA8FF` |
| `--phase-2` | `#E8A75A` |
| `--phase-3` | `#5FB6B0` |
| `--phase-4` / `--ph4` | `#3B3F91` |
| `--silver` | `#F3F6FB` |
| `--acc` (topic accents, examples) | `#8BB7EE`, `#8BB4EE`, `#12B5CB`, `#3A518D`, `#0A2A6B` |

Other recurring values: dark glass panels `rgba(0, 30, 80, 0.92)` / `rgba(0, 25, 72, 0.85)`; radius `--radius-sm: 10px`, `--radius-md: 16px`, `--radius-lg: 24px`, `--radius-xl: 32px`, also `--r-md: 22px`, `--r-lg: 30px`; easing `--ease: cubic-bezier(0.22, 1, 0.36, 1)`.

Omri asked for this briefing site to use **light blue and white text, large, clear, visible**. That maps naturally to `--blue` / `--blue-light` / white on `--navy-ink` or `--v7-td`, consistent with the existing LLA dark-hero language.

---

## Fonts

Homepage CSS:

- `--font-display: 'Codec Pro', 'Inter', sans-serif`
- `--font-body: 'Inter', sans-serif`
- Also used: `'Playfair Display'` (headings / editorial), **`'Instrument Serif'`** (serif accent — "gorgeous syllabus / lesson shine"), `'Codec Pro'` for UI display

Loaded from:

- https://fonts.cdnfonts.com/css/codec-pro
- https://fonts.cdnfonts.com/s/31902/CodecPro-Regular.woff
- https://fonts.cdnfonts.com/s/31902/CodecPro-Italic.woff
- Google Fonts, typical homepage combo: `Inter` (300–800) + `Instrument Serif` (normal + italic), sometimes with `Playfair Display`, `Bricolage Grotesque`, `Fraunces`, `Inter Tight`, or `Instrument Sans` on other pages.

**Local brand font files in this repo (confirmed via OpenType `name` table):**

- `IS.ttf` — Instrument Serif Regular
- `ISi.ttf` — Instrument Serif Italic

These are the LLA brand serif files from `/workspace/lla/`. Use them (or the Google Fonts equivalent) consistently. Do not mix in random new families.

---

## Logos (in this repo + live URLs)

| File in repo | Live URL (verified 200, 17 Nov 2026) |
| --- | --- |
| `lla-logo-exact-transparent@2x.png` | https://www.longevitylifeacademy.com/assets/lla-logo-exact-transparent@2x.png |
| | https://longevitylifeacademy.pages.dev/assets/lla-logo-nav.png |
| `e-teacher-logo.png` | https://longevitylifeacademy.pages.dev/assets/brand/e-teacher-logo.png |
| `logo.png` | local copy from `/workspace/lla/logo.png` (smaller mark) |

Related eTeacher marketing marks (live, not copied unless needed):

- https://www.eteachergroup.com/wp-content/uploads/2026/06/longevity-by-eteacher-logo.png
- https://www.eteachergroup.com/wp-content/uploads/2026/06/longevity-eteacher-front-page-photo-1.png
- French Atelier reference logo: https://www.eteachergroup.com/wp-content/uploads/2026/06/french-atelier-eteacher-logo.png

For this certificate page: LLA mark first, Bar-Ilan logo prominent (see `stakeholders.md`), partnership language rather than a "by eTeacher Group" lockup.

---

## Hero / motion footage and stills the builder can reuse

All of the following `longevitylifeacademy.pages.dev` URLs returned **HTTP 200** on 17 Nov 2026 unless noted. These are production assets already used on LLA.

### Video

- https://longevitylifeacademy.pages.dev/assets/cells-light.mp4 — hero-style cellular footage (poster: `cells-poster.jpg`)
- https://longevitylifeacademy.pages.dev/assets/daily-protocol-v2.mp4
- https://longevitylifeacademy.pages.dev/assets/exercise-yoga-v2.mp4
- https://longevitylifeacademy.pages.dev/assets/skill-skin.mp4 (poster: `posters/skill-skin.jpg`)
- https://longevitylifeacademy.pages.dev/assets/sleep-blog-v2.mp4
- https://longevitylifeacademy.pages.dev/assets/stress-management-cold-plunge-v2.mp4
- https://longevitylifeacademy.pages.dev/assets/supplements-wearables-know-v2.mp4
- https://longevitylifeacademy.pages.dev/assets/v2-mental-bubbles.mp4 (poster: `posters/v2-mental-bubbles.jpg`)
- https://longevitylifeacademy.pages.dev/assets/v2-nutrition-greens-v2.mp4
- https://longevitylifeacademy.pages.dev/assets/v2-supplements-meds.mp4 (poster: `posters/v2-supplements-meds.jpg`)
- https://longevitylifeacademy.pages.dev/assets/julie-film-v20260927/full-film-720p.mp4 (poster: `julie-approved-4k-poster.jpg`) — Julie masterclass film; **not automatically appropriate** as the hero of a Bar-Ilan academic certificate page
- https://d2ol7oe51mr4n9.cloudfront.net/user_3B2TkzjFQaqg6v69LxXPlh5VT9f/840377cc-cdf4-497b-8afc-06e67f3debbc.mp4 — additional CloudFront mp4 used on LLA properties
- https://lp.eteachergroup.com/videos/2488894945.mp4 — eTeacher LP video (check fit before use)

### Posters / stills

- https://longevitylifeacademy.pages.dev/assets/cells-poster.jpg
- https://longevitylifeacademy.pages.dev/assets/julie-approved-4k-poster.jpg
- https://longevitylifeacademy.pages.dev/assets/posters/skill-skin.jpg
- https://longevitylifeacademy.pages.dev/assets/posters/v2-mental-bubbles.jpg
- https://longevitylifeacademy.pages.dev/assets/posters/v2-supplements-meds.jpg
- https://longevitylifeacademy.pages.dev/assets/mc-zoom-chat.jpg — Zoom-class still (useful; Omri wants more teacher-on-Zoom mockups)
- https://longevitylifeacademy.pages.dev/assets/lingo-1.jpg, `lingo-2.jpg`, `lingo-6.jpg` — Abbott Lingo CGM stills (consumer course inclusion; not automatically part of the certificate)
- CloudFront stills under `https://d2ol7oe51mr4n9.cloudfront.net/user_3B2TkzjFQaqg6v69LxXPlh5VT9f/` : `0a8c890d-….jpg`, `4af35383-….jpg`, `73a3512e-….jpg`, `b7dec8a8-….jpg`

Artgrid / Artlist: Omri said the stack has them. **No Artgrid or Artlist URLs were present** in the crawled LLA HTML. Reuse the production footage above first; do not assume Artlist IDs.

---

## UI patterns to clone

From the live consumer site (homepage + pricing):

- Dark cinematic hero with looping muted video, large typography, clear "what you'll learn / what you get"
- Phase-colored curriculum (the four `--phase-*` colors) in compact sliders so mobile does not require long scrolling
- Swipe/slider rails (`lla-slider`, `rail-dots`) on press, curriculum, and pricing compares ("← Swipe to compare plans →")
- Floating WhatsApp control: `https://api.whatsapp.com/send/?phone=12029494750` and icon `https://longevitylifeacademy.pages.dev/assets/wa/whatsapp.svg`. **Unverified** whether this number should be used for the Bar-Ilan certificate product — confirm before shipping.
- Trustpilot-styled quotes module on the homepage (on-page markup; **no trustpilot.com profile URL found** in the crawl). Quotes are labelled e.g. "Trustpilot · 5 stars · September 2025". Do not invent new Trustpilot scores. Prefer real reviews if a profile is supplied later.
- Press / PR rail: AP News (20 July 2026) and Yahoo Finance (27 July 2026) cards + in-house blog deep dives
- Sticky enroll CTA; pricing as Monthly vs Upfront cards (see `pricing_facts.md` — consumer prices only)
- Masterclass / November promo CSS also in play: `/nov/nov-offer.css` (live 200 at https://www.longevitylifeacademy.com/nov/nov-offer.css)

---

## Blog and page structure (consumer site)

Sitemap (from `/workspace/lla/pages/_sitemap_xml.txt`):

- https://www.longevitylifeacademy.com/
- https://www.longevitylifeacademy.com/pricing.html
- https://www.longevitylifeacademy.com/about.html
- https://www.longevitylifeacademy.com/blog.html
- https://www.longevitylifeacademy.com/cgm.html
- https://www.longevitylifeacademy.com/biological-age-light.html
- https://www.longevitylifeacademy.com/store/longevity-blueprint/
- https://www.longevitylifeacademy.com/blueprint/
- https://www.longevitylifeacademy.com/refer-a-friend/
- Teachers: `/teachers/{julie-gibson-clark,amy,courtney,jordan,natalie}.html`
- Topic / blog articles:
  - https://www.longevitylifeacademy.com/topics/biomarkers-testing.html
  - https://www.longevitylifeacademy.com/topics/exercise-movement.html
  - https://www.longevitylifeacademy.com/topics/mental-emotional-health.html
  - https://www.longevitylifeacademy.com/topics/metabolic-health-blood-sugar.html
  - https://www.longevitylifeacademy.com/topics/nutrition-longevity.html
  - https://www.longevitylifeacademy.com/topics/protocols-habits.html
  - https://www.longevitylifeacademy.com/topics/sleep-circadian-health.html
  - https://www.longevitylifeacademy.com/topics/supplements-health-tech.html
- Guides (SEO):
  - https://www.longevitylifeacademy.com/guides/bryan-johnson-blueprint-alternative.html
  - https://www.longevitylifeacademy.com/guides/epigenetic-age-test-explained.html
  - https://www.longevitylifeacademy.com/guides/cgm-for-non-diabetics.html
  - https://www.longevitylifeacademy.com/guides/best-longevity-course.html
- Legal: `/privacy.html`, `/terms.html`

**Blog tone to match, market to change:** the consumer blog is "everyday adult, build your protocol." The certificate blog must be about **becoming a professional longevity / wellbeing adviser / instructor**, academic and expensive, while keeping the same visual craft (imagery in the syllabus, 3D/neon lighting, compact sliders).

Appendix A memory (non-verbatim) asked for **8 blog posts** as a deliverable. Do not treat that number as locked until Appendix A is in the repo.

---

## Masterclass PR / blog reference

- Repo: https://github.com/gitteromri-ux/lla-masterclass-press
- Live Pages: https://gitteromri-ux.github.io/lla-masterclass-press/ (HTTP 200)
- Files in that repo: `index.html`, `images/`, `julie-founding.jpg`, `lla-logo.jpg`
- Use it as the PR/press-rail pattern (outlet mark, date, real article link, strong portrait), not as faculty for this certificate.

Related live press URLs already used on LLA:

- AP News / EIN Presswire, 20 July 2026: https://apnews.com/press-release/ein-presswire-newsmatics/press-release-df2283f31104321eae816839632a3c48
- Yahoo Finance, 27 July 2026: https://finance.yahoo.com/healthcare/articles/julie-gibson-clark-2nd-slowest-aging-woman-on-earth-joins-longevity-life-academy-by-eteacher-group-195800053.html
  (URL as stored on the LLA blog card; confirm the live path at build time — the crawled href was `https://finance.yahoo.com/healthcare/articles/julie-gibson-clark-2nd-slowest-195800053.html`)

---

## French Atelier design reference

- https://frenchatelierlive.com/ and the Culture Capsules experience at https://frenchatelierlive.com/culture-capsules
- Look and feel Omri called out: every lesson shines, curriculum is gorgeous and compact (little scrolling), sliders, consistent fonts, premium motion.
- eTeacher homepage stills that already show the FA treatment: https://www.eteachergroup.com/wp-content/uploads/2026/06/french-atelier-eteacher-front-page-photo.png

---

## Naming / lockup guidance (from Omri t1073u + the proposal)

- Product brand: **Longevity Life Academy**
- Certificate name (from the proposal, use this): **Professional Certificate in Longevity and Lifelong Wellbeing Advisory Practice**
- Issued through **Bar-Ilan Akadima and Health 360, in partnership with eTeacher**
- Do **not** headline "Accredited by Bar-Ilan University" (there is no university accreditation)
- Do **not** lead with "by eTeacher Group"
- APHEA: only the "preparing to apply" gold line; no accreditation logo

---

## WhatsApp / floating buttons

- Consumer-site WhatsApp: `https://api.whatsapp.com/send/?phone=12029494750`
- Icon: https://longevitylifeacademy.pages.dev/assets/wa/whatsapp.svg
- Confirm the number before using it on the certificate page.
