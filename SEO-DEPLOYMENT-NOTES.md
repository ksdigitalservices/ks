# SEO deployment notes

## GitHub Pages redirect limitation

This repository uses Jekyll `jekyll-redirect-from` for legacy URLs. GitHub Pages is a static hosting platform, so repository-level redirects are generated as redirect HTML rather than configurable server-side HTTP 301 responses. GitHub Pages currently supports the `jekyll-redirect-from` plugin, but this is not equivalent to setting an HTTP 301 status at the server.

For true HTTP 301 status codes, deploy the paths in `redirects-301.csv` at a reverse proxy/CDN such as Cloudflare, or move redirect handling to a platform that supports HTTP redirect rules. Do not claim that GitHub Pages itself is returning 301 until verified with `curl -I`.

## Search Console

After deployment:
1. Submit `https://ksdigitalservices.in/sitemap.xml`.
2. Inspect representative new canonical URLs.
3. Inspect representative legacy URLs and confirm they redirect to the intended destination.
4. Monitor Page indexing, Crawl Stats, Core Web Vitals, and Search results.
5. Check for `Duplicate without user-selected canonical`, `Page with redirect`, 404s, and unexpected noindex pages.
