// Owner: scaffold (SITE-SPEC §3). Allows everything and points to the absolute sitemap index URL.
import type { APIRoute } from 'astro';
import { withBase } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL(withBase('/sitemap-index.xml'), site ?? 'http://localhost:4321').href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
