#!/usr/bin/env python3
"""Add the Google tag (GTM-5BD2LBVB) right after <head> on every page.

Run from the repo root after copying a fresh build into it, before pushing:
    python3 tools/add-google-tag.py
Pages that already have the tag are skipped, so it is safe to run twice.
The Search Console verification file (google*.html) is left alone.
"""
import glob, re

TAG = """<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-5BD2LBVB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>
"""

added = 0
for path in glob.glob("**/*.html", recursive=True):
    if path.startswith("google"):
        continue
    html = open(path, encoding="utf-8").read()
    if "GTM-5BD2LBVB" in html:
        continue
    m = re.search(r"<head[^>]*>", html)
    if not m:
        print("no <head>:", path)
        continue
    html = html[: m.end()] + "\n" + TAG + html[m.end():]
    open(path, "w", encoding="utf-8").write(html)
    added += 1
print(f"Google tag added to {added} page(s).")
