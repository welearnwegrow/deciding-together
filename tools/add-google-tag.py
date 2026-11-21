#!/usr/bin/env python3
"""Add the Google tag (GTM-5BD2LBVB), with consent mode set to denied, right after <head> on every page.

Run from the repo root after copying a fresh build into it, before pushing:
    python3 tools/add-google-tag.py
Pages that already have the tag are skipped, so it is safe to run twice.
The Search Console verification file (google*.html) is left alone.
"""
import glob, re

TAG = """<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  /* Google consent mode: nothing is stored on the reader's device, so Google Analytics sends only cookieless pings */
  gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', functionality_storage: 'denied', personalization_storage: 'denied', security_storage: 'denied'});
  gtag('js', new Date());
</script>
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-5BD2LBVB"></script>
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
