#!/usr/bin/env python3
"""Fetches every page on the live GitHub Pages site and requests every internal asset and link it references."""
import sys
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

BASE = "https://gitteromri-ux.github.io/lla-barilan-certificate/"
START = ["", "site/", "site/legal.html", "site/blog/"]


class Refs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k in ("href", "src", "poster", "data-src", "data-src-sm", "data-poster") and v and not v.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
                self.refs.append(v)


def get(url, method="GET"):
    req = urllib.request.Request(url, method=method, headers={"User-Agent": "Mozilla/5.0 link-check"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, (r.read() if method == "GET" else b"")
    except urllib.error.HTTPError as e:
        return e.code, b""
    except Exception as e:  # noqa: BLE001
        return str(e), b""


def main():
    pages, seen, bad = list(START), set(), []
    checked = 0
    while pages:
        rel = pages.pop(0)
        url = urljoin(BASE, rel)
        if url in seen:
            continue
        seen.add(url)
        code, body = get(url)
        checked += 1
        if code != 200:
            bad.append((code, url, "page"))
            continue
        p = Refs()
        p.feed(body.decode("utf-8", "ignore"))
        for ref in p.refs:
            target = urljoin(url, ref).split("#")[0]
            if not target.startswith(BASE) or target in seen:
                continue
            if target.endswith((".html", "/")):
                pages.append(target[len(BASE):])
                continue
            seen.add(target)
            c, _ = get(target, "HEAD")
            checked += 1
            if c != 200:
                bad.append((c, target, url))
    print(f"live URLs checked: {checked}; failures: {len(bad)}")
    for b in bad:
        print("  !", b)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
