#!/usr/bin/env node
/**
 * Internal link and anchor check for the built site. Run after `npm run build`.
 * Uses BASE_PATH (default "/") to map URLs back to files in dist/.
 *
 * Checks every href/src on every page that points inside the site:
 *  - the target file exists in dist/,
 *  - any #fragment exists as an id on the target page.
 * External links (http/https), mailto:, tel: and data: URLs are not checked.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const exists = (p) =>
  stat(p).then(
    (s) => s.isFile(),
    () => false,
  );

const idCache = new Map();
async function idsIn(file) {
  if (!idCache.has(file)) {
    const html = await readFile(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

async function resolveTarget(urlPath) {
  if (!urlPath.startsWith(BASE)) return null;
  const rel = decodeURIComponent(urlPath.slice(BASE.length));
  const candidates = rel === '' || rel.endsWith('/')
    ? [join(DIST, rel, 'index.html')]
    : [join(DIST, rel), join(DIST, rel, 'index.html'), join(DIST, `${rel}.html`)];
  for (const c of candidates) if (await exists(c)) return c;
  return null;
}

async function main() {
  const files = (await walk(DIST)).filter((f) => f.endsWith('.html'));
  const failures = [];
  let checked = 0;

  for (const file of files) {
    const rel = relative(DIST, file).split(sep).join('/');
    const html = await readFile(file, 'utf8');
    const pageUrl = BASE + rel.replace(/index\.html$/, '');

    for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
      const raw = m[1].replace(/&amp;/g, '&');
      if (!raw || /^(https?:|mailto:|tel:|data:|\/\/)/i.test(raw)) continue;
      checked++;
      const [pathPart, fragment] = raw.split('#');
      const targetPath = pathPart === '' ? pageUrl : posix.resolve(posix.dirname(pageUrl + 'x'), pathPart) + (pathPart.endsWith('/') ? '/' : '');
      const target = pathPart === '' ? file : await resolveTarget(targetPath.split('?')[0]);
      if (!target) {
        failures.push(`${rel}: broken link "${raw}"`);
        continue;
      }
      if (fragment && !(await idsIn(target)).has(fragment)) {
        failures.push(`${rel}: missing anchor "#${fragment}" in "${raw}"`);
      }
    }
  }

  if (failures.length) {
    console.error(`check:links failed (${failures.length}):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(`check:links passed: ${checked} internal links across ${files.length} pages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
