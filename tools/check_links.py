#!/usr/bin/env python3
"""Checks every internal link/asset and every external URL across the built site.

Usage: python3 tools/check_links.py [--external]
"""
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parent.parent
PAGES = [ROOT / "index.html", ROOT / "site" / "index.html", ROOT / "site" / "legal.html"] + sorted((ROOT / "site" / "blog").glob("*.html"))
BASE = "https://gitteromri-ux.github.io/lla-barilan-certificate/"


class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.ids = [], set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        for k in ("href", "src", "poster", "data-src", "data-src-sm"):
            v = a.get(k)
            if v and not v.startswith(("mailto:", "tel:", "data:", "javascript:")):
                self.refs.append((tag, k, v))


def page_url(p):
    return BASE + str(p.relative_to(ROOT)).replace("\\", "/")


def local_path(url):
    path = urlparse(url).path
    rel = path[len(urlparse(BASE).path):]
    target = ROOT / rel
    if rel == "" or rel.endswith("/"):
        target = target / "index.html"
    return target


def main():
    check_external = "--external" in sys.argv
    problems, externals, ids_by_page = [], {}, {}
    parsed = {}
    for p in PAGES:
        c = Collector()
        c.feed(p.read_text(encoding="utf-8"))
        parsed[p] = c
        ids_by_page[local_path(page_url(p)).resolve()] = c.ids
    for p, c in parsed.items():
        here = page_url(p)
        for tag, attr, ref in c.refs:
            if ref.startswith("#"):
                if ref != "#" and ref[1:] not in c.ids and tag != "use":
                    problems.append(f"{p.relative_to(ROOT)}: missing anchor {ref}")
                continue
            url = urljoin(here, ref)
            if url.startswith(BASE):
                target = local_path(url)
                if not target.exists():
                    problems.append(f"{p.relative_to(ROOT)}: missing file {ref} -> {target.relative_to(ROOT)}")
                frag = urlparse(url).fragment
                if frag and target.suffix == ".html" and target.exists():
                    ids = ids_by_page.get(target.resolve())
                    if ids is not None and frag not in ids:
                        problems.append(f"{p.relative_to(ROOT)}: missing anchor #{frag} in {target.relative_to(ROOT)}")
            elif url.startswith("http"):
                externals.setdefault(url.split("#")[0], set()).add(str(p.relative_to(ROOT)))
    print(f"pages checked: {len(PAGES)}; internal problems: {len(problems)}")
    for x in problems:
        print("  !", x)
    if check_external:
        print(f"external URLs: {len(externals)}")
        bad = 0
        for u in sorted(externals):
            code = subprocess.run(["curl", "-s", "-o", "/dev/null", "-L", "--max-time", "25", "-A",
                                   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
                                   "-w", "%{http_code}", u], capture_output=True, text=True).stdout.strip()
            flag = "" if code in ("200", "206") else "  <-- check"
            if flag:
                bad += 1
            print(f"  {code} {u}{flag}")
        print(f"external non-200: {bad}")


if __name__ == "__main__":
    main()
