# French Atelier reference study

Screenshots of the benchmark sites, captured on 18 Nov 2026 at 1440 × 900 (desktop) and 390 × 844 (mobile, shown at 1×):

- `fa-home-1440-*.jpg`, `fa-home-390-*.jpg`: https://www.frenchatelierlive.com/
- `fa-capsules-1440-*.jpg`, `fa-capsules-390-*.jpg`: https://www.frenchatelierlive.com/culture-capsules (review access)
- `sheet-*.jpg`: contact sheets of each sequence

## Component inventory

Counts come from the live DOM after a full scroll.

| | Home | Culture Capsules |
|---|---|---|
| Sections | 16 | 12 |
| Videos | 10 | 14 |
| Images | 38 | 48 |
| Slider / rail systems | 5 (paths, journey arc, stats marquee, teachers, testimonials) | Mobile rails on every card row |
| Glass elements (backdrop-filter) | 103 | 41 |
| 3D perspective layers | 14 | 14 |
| Canvas | 1 (interactive map) | 0 |
| Accordion / FAQ | yes | yes |
| Enroll modal | yes | yes |
| Fixed elements | header, bottom enroll bar, WhatsApp | header, mobile enroll pill, WhatsApp |

Component types seen:

- **Cinematic hero:** full-bleed video or photo with a serif headline and an italic accent phrase, a fact row, a price and a CTA.
- **Path and capsule cards:** image cards with an eyebrow, title, meta and a CTA. On mobile they become swipe rails with a "1 / 3 · Swipe to explore" counter and arrows.
- **Journey slider:** an arc track with level nodes and step cards with arrows.
- **Stat cards and counters:** big numbers, plus a marquee of partner logos.
- **Portrait sliders:** teacher and insider cards.
- **Video cards:** "In their own words" panels with play states.
- **Interactive map:** a canvas with glowing nodes, a layered depth effect.
- **Pricing cards:** with a highlighted tier.
- **Dark credibility bands:** stats on navy.
- **FAQ:** an accordion on a light ground.
- **Article rail:** blog cards in a horizontal slider.
- **Final CTA:** a full-bleed cinematic band.
- **Sticky CTAs:** a bottom bar on desktop and a pill on mobile, plus a WhatsApp float.

Motion and depth: reveal-on-scroll classes, glass panels over imagery, hover lifts, video loops and a marquee.

## How the landing page answers it

- **Color:** a deep black base with luminous ice-to-violet-to-gold gradients. Each course has its own accent, and dark cinematic sections alternate with bright porcelain ones.
- **Five Swiper carousels:** the advisor method as a card stack, the audiences, the courses as a 3D coverflow with a video in each card, program moments as an autoplaying video strip, and the insights. All have bullets, arrows and touch drag.
- **Motion:** a pinned scroll story for "Why now", animated counters, word-by-word headline reveals, layered parallax, 3D tilt glass with a pointer-following highlight, and Lenis smooth scrolling. All of it is disabled under reduced motion.
