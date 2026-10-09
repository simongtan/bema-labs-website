/**
 * Base-path helper (SITE-SPEC §2.2).
 *
 * The site may be served from a project Pages URL such as https://<owner>.github.io/<repo>/,
 * so every internal URL must go through withBase().
 *
 *   withBase('/services/')       -> '/<repo>/services/'
 *   withBase('/')                -> '/<repo>/'
 *   withBase('#faq')             -> '#faq'
 *   withBase('mailto:a@b.c')     -> 'mailto:a@b.c'
 *   withBase('https://x.y/')     -> 'https://x.y/'
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${BASE}${path}`;
}

/** Absolute URL for an internal path, e.g. for canonical and Open Graph tags. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(withBase(path), site ?? 'http://localhost:4321').href;
}
