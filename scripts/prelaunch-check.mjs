#!/usr/bin/env node
/**
 * Pre-launch gate (SITE-SPEC §2.3 and §8). Runs in the deploy workflow before the build.
 *
 * Fails (exit 1) when:
 *  - site.contactEmail in src/config/site.ts is null, empty, malformed or a placeholder,
 *  - .gitignore does not exclude _source/, *.zip and docs/,
 *  - public/ contains internal files (_source, docs, .md, .zip, .pdf, .docx).
 *
 * `npm run build` does not run this check, so local builds still succeed while the email is unset.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const failures = [];

// 1. Contact email. Read the property inside `export const site = { ... }` only, anchored to the
// start of its line, so the header comment ("contactEmail: null until ...") and the interface
// declaration (`contactEmail: string | null;`) are never matched.
const siteTs = await readFile(join(ROOT, 'src/config/site.ts'), 'utf8');
const siteObject = siteTs.slice(Math.max(0, siteTs.search(/^export const site\b/m)));
const match = siteObject.match(/^\s*contactEmail:\s*(null|'([^']*)'|"([^"]*)")\s*,?\s*(\/\/.*)?$/m);
if (!match) {
  failures.push('Could not find `contactEmail` in src/config/site.ts.');
} else if (match[1] === 'null') {
  failures.push(
    'site.contactEmail is null. Set the address Simon has approved for publication in src/config/site.ts.',
  );
} else {
  const email = (match[2] ?? match[3] ?? '').trim();
  const placeholder =
    /(example\.(com|org|net)|placeholder|your[-_.]?(name|email)|changeme|todo|tbd|test@|@test\.|xxx)/i;
  if (!email) failures.push('site.contactEmail is empty.');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    failures.push(`site.contactEmail "${email}" is not a valid email address.`);
  else if (placeholder.test(email))
    failures.push(`site.contactEmail "${email}" looks like a placeholder.`);
  else if (/simon\.g\.tan/i.test(email))
    failures.push(
      'site.contactEmail is a personal address that must not be published. If Simon explicitly supplies it for this purpose, also update the forbidden-terms list in scripts/check-content.mjs.',
    );
}

// 2. .gitignore hygiene
const gitignore = await readFile(join(ROOT, '.gitignore'), 'utf8').catch(() => '');
const ignored = gitignore.split(/\r?\n/).map((l) => l.trim());
for (const required of ['_source/', '*.zip', 'docs/']) {
  if (!ignored.includes(required)) failures.push(`.gitignore must contain "${required}".`);
}

// 3. Nothing internal in public/
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(full + sep, ...(await walk(full)));
    else out.push(full);
  }
  return out;
}
const publicDir = join(ROOT, 'public');
for (const file of await walk(publicDir).catch(() => [])) {
  const rel = relative(publicDir, file).split(sep).join('/');
  if (/(^|\/)(_source|docs)(\/|$)/i.test(rel) || /\.(md|zip|pdf|docx)$/i.test(rel)) {
    failures.push(`public/${rel} is an internal file and must not be published.`);
  }
}

if (failures.length) {
  console.error('check:prelaunch failed. Deploy is blocked until these are fixed:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('check:prelaunch passed.');
