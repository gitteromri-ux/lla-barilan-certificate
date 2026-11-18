#!/usr/bin/env python3
"""Builds the Insights journal and injects generated blocks into the landing page.

Usage: python3 tools/build.py
- content/blog/*.md  ->  site/blog/<slug>.html, site/blog/index.html
- framework diagram + insights rail  ->  site/index.html (between marker comments)
"""
import html
import json
import re
import sys
from pathlib import Path

import markdown
import yaml

sys.path.insert(0, str(Path(__file__).parent))
import framework_svg  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
CONTENT = ROOT / "content" / "blog"
BLOG = SITE / "blog"

ORDER = [
    "what-actually-extends-healthy-life",
    "appraising-longevity-claims",
    "food-as-medicine-dietary-patterns-and-equity",
    "behavior-change-toolkit-for-advisors",
    "sleep-stress-and-healthy-aging",
    "purpose-meaning-and-emotional-wellbeing",
    "social-connection-and-longevity",
    "scope-of-practice-for-wellbeing-advisors",
]
COVERS = {
    "what-actually-extends-healthy-life": "course-1-science",
    "appraising-longevity-claims": "hero-evidence",
    "food-as-medicine-dietary-patterns-and-equity": "course-2-food",
    "behavior-change-toolkit-for-advisors": "course-3-habits",
    "sleep-stress-and-healthy-aging": "course-4-sleep",
    "purpose-meaning-and-emotional-wellbeing": "course-5-purpose",
    "social-connection-and-longevity": "course-6-social",
    "scope-of-practice-for-wellbeing-advisors": "opp-individuals",
}
STAGE_COLOR = {1: "var(--s1)", 2: "var(--s2)", 3: "var(--s3)", 4: "var(--s4)"}
STAGE_NAME = {1: "Stage 1 · Scientific foundations", 2: "Stage 2 · Health behaviors", 3: "Stage 3 · Emotional & social wellbeing", 4: "Stage 4 · Practicum & capstone"}

def _sprite():
    for src in (ROOT / "site" / "index.html", ROOT / "site" / "blog" / "index.html"):
        text = src.read_text(encoding="utf-8") if src.exists() else ""
        k = text.find('<svg width="0" height="0"')
        if k != -1:
            return text[k:text.index("</svg>", k) + 6]
    return ""


SPRITE = _sprite()

e = html.escape


def load_articles():
    arts = []
    for path in sorted(CONTENT.glob("*.md")):
        raw = path.read_text(encoding="utf-8")
        m = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", raw, re.S)
        if not m:
            print(f"! {path.name}: missing front matter")
            continue
        meta = yaml.safe_load(m.group(1))
        meta["body_md"] = m.group(2).strip()
        meta["slug"] = meta.get("slug") or path.stem
        arts.append(meta)
    arts.sort(key=lambda a: ORDER.index(a["slug"]) if a["slug"] in ORDER else 99)
    for i, a in enumerate(arts, 1):
        a["n"] = i
        a["stage"] = int(a.get("stage", 1))
        a["color"] = STAGE_COLOR.get(a["stage"], "var(--sky)")
        a["cover"] = COVERS.get(a["slug"], "hero-science")
        a["refs"] = {int(r["n"]): r for r in a.get("references", [])}
    return arts


CITE_RE = re.compile(r"\[(\d+(?:\s*(?:,|–|-)\s*\d+)*)\]")


def render_body(a):
    body_html = markdown.markdown(a["body_md"], extensions=["tables", "sane_lists"], output_format="html5")
    cited = set()

    def link(match):
        parts = re.split(r"\s*,\s*", match.group(1))
        out = []
        for part in parts:
            rng = re.split(r"\s*[–-]\s*", part)
            first = int(rng[0])
            nums = list(range(first, int(rng[-1]) + 1)) if len(rng) == 2 else [first]
            for n in nums:
                cited.add(n)
                if n not in a["refs"]:
                    print(f"! {a['slug']}: citation [{n}] has no reference")
            label = "–".join(rng)
            out.append(f'<a href="#ref-{first}" aria-label="Reference {label}">{label}</a>')
        return f'<sup class="cite">{",".join(out)}</sup>'

    # only rewrite text outside tags
    pieces = re.split(r"(<[^>]+>)", body_html)
    pieces = [p if p.startswith("<") else CITE_RE.sub(link, p) for p in pieces]
    body_html = "".join(pieces)
    missing = set(a["refs"]) - cited
    if missing:
        print(f"! {a['slug']}: references never cited: {sorted(missing)}")
    words = len(re.findall(r"\b[\w’'-]+\b", re.sub(r"\[[\d,\s–-]+\]", "", a["body_md"])))
    a["words"] = words
    return body_html


def cover_html(a, size=""):
    return (f'<div class="cover {size}" style="--c:{a["color"]}">'
            f'<img src="{{base}}assets/video/{a["cover"]}.jpg" alt="" loading="lazy">'
            f'<span class="c-n">{a["n"]:02d}</span>'
            f'<span class="c-tag">{e(a["category"])}</span>'
            f'<span class="c-mark">LLA Insights · {e(a["course"].split("·")[0].strip())}</span></div>')


def header_html(base, current=""):
    return f'''<header class="site-header is-scrolled" id="header">
  <div class="wrap bar">
    <a class="lockup" href="{base}index.html" aria-label="Longevity Life Academy, in partnership with Bar-Ilan University — program home">
      <img class="lla" src="{base}assets/img/lla-logo-sm.png" width="320" height="103" alt="Longevity Life Academy">
      <span class="divider" aria-hidden="true"></span>
      <img class="biu" src="{base}assets/img/biu-logo-white.png?v=en" width="833" height="309" alt="Bar-Ilan University">
    </a>
    <nav class="nav" aria-label="Primary">
      <a href="{base}index.html#journey">Program</a>
      <a href="{base}index.html#method">Method</a>
      <a href="{base}index.html#opportunities">Opportunities</a>
      <a href="{base}index.html#certification">Certification</a>
      <a href="{base}index.html#tuition">Tuition</a>
      <a href="{base}blog/"{' class="is-current"' if current == 'blog' else ''}>Insights</a>
    </nav>
    <div class="header-cta">
      <a class="btn btn-primary btn-sm" href="{base}index.html#register" data-cta="blog-header">Register interest<span class="arr"><svg><use href="#i-arrow"/></svg></span></a>
      <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span></button>
    </div>
  </div>
  <span class="progress" aria-hidden="true"></span>
</header>
<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
  <nav aria-label="Mobile">
    <a href="{base}index.html#journey">Program</a><a href="{base}index.html#method">Method</a><a href="{base}index.html#opportunities">Opportunities</a><a href="{base}index.html#certification">Certification</a><a href="{base}index.html#tuition">Tuition</a><a href="{base}blog/">Insights</a>
  </nav>
  <a class="btn btn-primary btn-block" href="{base}index.html#register">Register your interest<span class="arr"><svg><use href="#i-arrow"/></svg></span></a>
</div>'''


def footer_html(base):
    return f'''<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="lockup" href="{base}index.html" aria-label="Program home">
          <img class="lla" src="{base}assets/img/lla-logo-sm.png" width="320" height="103" alt="Longevity Life Academy" loading="lazy">
          <span class="divider" aria-hidden="true"></span>
          <img class="biu" src="{base}assets/img/biu-logo-white.png?v=en" width="833" height="309" alt="Bar-Ilan University" loading="lazy">
        </a>
        <p>Professional Certificate in Longevity and Lifelong Wellbeing Advisory Practice. Issued through Bar-Ilan Akadima and Health 360, in partnership with Longevity Life Academy.</p>
      </div>
      <div><h3>Program</h3><ul><li><a href="{base}index.html#journey">Program journey</a></li><li><a href="{base}index.html#method">Methodology</a></li><li><a href="{base}index.html#certification">Certification</a></li><li><a href="{base}index.html#faq">FAQ</a></li></ul></div>
      <div><h3>Insights</h3><ul><li><a href="{base}blog/">All articles</a></li><li><a href="{base}index.html#register">Register interest</a></li></ul></div>
      <div><h3>Legal</h3><ul><li><a href="{base}legal.html#privacy">Privacy notice</a></li><li><a href="{base}legal.html#terms">Terms</a></li><li><a href="{base}legal.html#cookies">Cookies</a></li></ul></div>
    </div>
    <div class="footer-notes">
      <p><b>Editorial note.</b> Insights articles are evidence summaries for professionals, not medical advice. Program details remain subject to final institutional approval.</p>
    </div>
    <div class="footer-base"><span>© 2026 Longevity Life Academy is operated by eTeacher Group. All rights reserved.</span><span><a href="{base}legal.html#privacy">Privacy</a> · <a href="{base}legal.html#terms">Terms</a></span></div>
  </div>
</footer>'''


HEAD = '''<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#040D24">
<meta property="og:type" content="{ogtype}">
<meta property="og:title" content="{ogtitle}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://gitteromri-ux.github.io/lla-barilan-certificate/site/assets/video/{ogimg}.jpg">
<link rel="icon" type="image/png" href="{base}assets/img/favicon.png">
<link rel="preload" href="{base}assets/fonts/InstrumentSerif-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{base}assets/fonts/Inter-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{base}assets/css/base.css">
<link rel="stylesheet" href="{base}assets/css/site.css">
<link rel="stylesheet" href="{base}assets/css/blog.css">
<script>document.documentElement.classList.replace('no-js','js');</script>
{jsonld}
</head>'''


def article_page(a, arts):
    base = "../"
    body = render_body(a)
    refs = "".join(
        f'<li id="ref-{n}">{e(r["text"])}'
        + (f' <a href="{e(r["url"])}" target="_blank" rel="noopener">{e(r["url"])}</a>' if r.get("url") else "")
        + "</li>"
        for n, r in sorted(a["refs"].items())
    )
    summary = "".join(f"<li>{e(p)}</li>" for p in a.get("summary_points", []))
    related = [x for x in arts if x["slug"] != a["slug"]]
    related = sorted(related, key=lambda x: (abs(x["stage"] - a["stage"]), x["n"]))[:4]
    ps_refs = "; ".join(e(r["text"]) for _, r in sorted(a["refs"].items())[:4])
    jsonld = json.dumps({
        "@context": "https://schema.org", "@type": "Article", "headline": a["title"], "description": a["dek"],
        "about": a["course"], "publisher": {"@type": "Organization", "name": "Longevity Life Academy"},
        "citation": [r.get("url") for _, r in sorted(a["refs"].items()) if r.get("url")],
    }, ensure_ascii=False)
    head = HEAD.format(
        title=f'{e(a["title"])} · LLA Insights', desc=e(a["dek"]), ogtype="article", ogtitle=e(a["title"]),
        ogimg=a["cover"], base=base, jsonld=f'<script type="application/ld+json">{jsonld}</script>')
    cover = cover_html(a).replace("{base}", base)
    return f'''{head}
<body class="journal">
<a class="skip" href="#main">Skip to content</a>
{SPRITE}
{header_html(base, 'blog')}
<main id="main">
  <section class="a-hero" style="--c:{a["color"]}">
    <div class="wrap">
      <p class="crumbs"><a href="{base}blog/">Insights</a><span aria-hidden="true">/</span><span>{e(a["course"])}</span></p>
      <span class="a-k">{e(a["category"])}</span>
      <h1>{e(a["title"])}</h1>
      <p class="a-dek">{e(a["dek"])}</p>
      <p class="a-meta"><span><b>{e(a["course"])}</b></span><span>{e(STAGE_NAME.get(a["stage"], ""))}</span><span>{a.get("reading_minutes", 6)} min read</span><span>LLA Insights editorial team</span></p>
    </div>
    <div class="a-cover">{cover}</div>
  </section>
  <div class="a-layout">
    <article class="a-paper">
      <div class="a-body">
        <section class="summary" aria-labelledby="sum-h">
          <div class="summary-head"><span class="label" id="sum-h">One-page summary</span><button class="print-btn js-print" type="button"><svg><use href="#i-layers"/></svg>Download summary (PDF)</button></div>
          <ol>{summary}</ol>
        </section>
        {body}
        <div class="practice">
          <div class="box"><span class="label">In practice</span><h3>How an advisor applies this</h3><p>{e(a.get("in_practice", ""))}</p></div>
          <div class="box"><span class="label">Scope note</span><h3>Boundaries and referral</h3><p>{e(a.get("scope_note", ""))}</p></div>
        </div>
        <section class="refs" aria-labelledby="refs-h"><h2 id="refs-h">References</h2><ol>{refs}</ol></section>
        <p class="a-disclaimer">This article summarizes published evidence for professionals. It is not medical advice and does not describe outcomes of the certificate program.</p>
      </div>
      <aside class="a-aside">
        <div class="a-sticky">
          <div class="box dark" style="--c:{a["color"]}"><span class="label">Maps to the program</span><h3>{e(a["course"])}</h3><p>Part of the Professional Certificate in Longevity and Lifelong Wellbeing Advisory Practice, developed at Bar-Ilan University’s Health 360 Center.</p><a class="btn btn-primary btn-sm" href="{base}index.html#journey">See the program<span class="arr"><svg><use href="#i-arrow"/></svg></span></a></div>
          <div class="box"><span class="label">Interest list open</span><h3>Become a Certified Longevity and Lifelong Wellbeing Advisor</h3><p>Proposed designation, subject to final institutional approval.</p><a class="btn btn-ink btn-sm" href="{base}index.html#register" data-cta="blog-aside">Register your interest<span class="arr"><svg><use href="#i-arrow"/></svg></span></a></div>
        </div>
      </aside>
    </article>
  </div>
  <section class="a-next">
    <div class="wrap">
      <p class="kicker"><b>More</b><i></i>Continue reading</p>
      <div class="ins-rail">{"".join(insight_card(r, base) for r in related)}</div>
    </div>
  </section>
</main>
{footer_html(base)}
<div class="print-sheet" aria-hidden="true">
  <div class="ps-top"><img src="{base}assets/img/lla-logo-dark.png" alt=""><span class="ps-k">LLA Insights · One-page summary</span></div>
  <span class="ps-k">{e(a["course"])}</span>
  <h1>{e(a["title"])}</h1>
  <p class="ps-dek">{e(a["dek"])}</p>
  <ol>{summary}</ol>
  <div class="ps-box"><b>In practice</b>{e(a.get("in_practice", ""))}</div>
  <div class="ps-box"><b>Scope note</b>{e(a.get("scope_note", ""))}</div>
  <p class="ps-refs"><b>Key sources:</b> {ps_refs}</p>
  <p class="ps-foot">Professional Certificate in Longevity and Lifelong Wellbeing Advisory Practice · developed at Bar-Ilan University’s Health 360 Center · issued through Bar-Ilan Akadima and Health 360, in partnership with Longevity Life Academy (subject to final institutional approval). Not medical advice.</p>
</div>
<script src="{base}assets/js/blog.js" defer></script>
</body>
</html>
'''


def insight_card(a, base):
    return (f'<a class="ins-card" href="{base}blog/{a["slug"]}.html" style="--c:{a["color"]}">'
            f'<span class="ins-cover"><img src="{base}assets/video/{a["cover"]}.jpg" alt="" loading="lazy"><span class="n">{a["n"]:02d}</span></span>'
            f'<span class="ins-body"><span class="k">{e(a["course"])}</span><h3>{e(a["title"])}</h3><p>{e(a["dek"])}</p>'
            f'<span class="rt">{a.get("reading_minutes", 6)} min read · {len(a["refs"])} references</span></span></a>')


def index_page(arts):
    base = "../"
    cards = []
    for i, a in enumerate(arts):
        cls = "j-card feature" if i == 0 else "j-card"
        cards.append(
            f'<a class="{cls}" href="{a["slug"]}.html" data-stage="{a["stage"]}" style="--c:{a["color"]}">'
            + cover_html(a).replace("{base}", base)
            + f'<span class="j-body"><span class="k">{e(a["course"])}</span><h2>{e(a["title"])}</h2><p>{e(a["dek"])}</p>'
            f'<span class="rt"><span>{a.get("reading_minutes", 6)} min read</span><span>{len(a["refs"])} references</span></span></span></a>')
    head = HEAD.format(title="Insights for Longevity and Lifelong Wellbeing Advisors · LLA", desc="Evidence-based articles for professionals becoming Longevity and Lifelong Wellbeing Advisors, mapped to the six courses of the professional certificate.", ogtype="website", ogtitle="LLA Insights", ogimg="hero-evidence", base=base, jsonld="")
    return f'''{head}
<body class="journal">
<a class="skip" href="#main">Skip to content</a>
{SPRITE}
{header_html(base, 'blog')}
<main id="main">
  <section class="j-mast">
    <div class="wrap">
      <p class="kicker"><b>LLA</b><i></i>Insights journal</p>
      <h1 class="display-l">Evidence, <em>for the people who apply it.</em></h1>
      <p class="lead">Eight evidence-based articles for professionals becoming Longevity and Lifelong Wellbeing Advisors, each mapped to a stage and course of the professional certificate. Every claim is referenced.</p>
      <div class="j-filter" role="group" aria-label="Filter by stage">
        <button type="button" aria-pressed="true" data-filter="all">All articles</button>
        <button type="button" aria-pressed="false" data-filter="1">Stage 1 · Science</button>
        <button type="button" aria-pressed="false" data-filter="2">Stage 2 · Health behaviors</button>
        <button type="button" aria-pressed="false" data-filter="3">Stage 3 · Emotional &amp; social</button>
        <button type="button" aria-pressed="false" data-filter="4">Stage 4 · Practice</button>
      </div>
    </div>
  </section>
  <div class="wrap"><div class="j-grid">{"".join(cards)}</div></div>
</main>
{footer_html(base)}
<script src="{base}assets/js/blog.js" defer></script>
</body>
</html>
'''


def inject(text, marker, block):
    start, end = f"<!-- {marker}:START -->", f"<!-- {marker}:END -->"
    if start not in text or end not in text:
        return text
    i, j = text.index(start), text.index(end)
    return text[: i + len(start)] + "\n" + block + "\n" + text[j:]


def main():
    arts = load_articles()
    BLOG.mkdir(parents=True, exist_ok=True)
    for a in arts:
        (BLOG / f"{a['slug']}.html").write_text(article_page(a, arts), encoding="utf-8")
        print(f"  built blog/{a['slug']}.html  ({a['words']} words, {len(a['refs'])} refs)")
    if arts:
        (BLOG / "index.html").write_text(index_page(arts), encoding="utf-8")
        print(f"  built blog/index.html ({len(arts)} articles)")
    idx = SITE / "index.html"
    text = idx.read_text(encoding="utf-8")
    text = inject(text, "FRAMEWORK_SVG", framework_svg.build())
    text = inject(text, "INSIGHTS", "\n".join(insight_card(a, "") for a in arts))
    idx.write_text(text, encoding="utf-8")
    print("  injected framework + insights into site/index.html")


if __name__ == "__main__":
    main()
