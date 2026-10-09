#!/usr/bin/env node
/**
 * Content scan for the built site (SITE-SPEC §9). Run after `npm run build`.
 *
 * Fails (exit 1) if any dist/**\/*.html:
 *  - contains a forbidden term (case-insensitive; word terms use word boundaries),
 *  - contains "$" in visible markup (after removing <script> and <style>),
 *  - has an element with class "example" that does not show the text "Illustrative example",
 *  - does not have exactly one <h1>.
 * Also fails if dist/ contains internal files (_source, docs, .md, .zip, .pdf, .docx).
 * When CI is set (GitHub Actions), also fails if /contact/ lacks the mailto button with the encoded
 * walkthrough template and the visible address, or /privacy/ does not link that address.
 * Locally those contact checks only warn, so builds with site.contactEmail unset stay usable.
 *
 * To allow an approved term later (e.g. a product name), add it to ALLOW rather than deleting
 * the broader rule.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

// Word terms: matched case-insensitively with word boundaries on both sides.
const WORD_TERMS = [
  'Akura',
  'Kelso',
  'precast',
  'concrete',
  'GME',
  'Nerfed',
  'parent company',
  'no upfront',
  'upfront cost',
  'upfront costs',
  'AUD',
  'ROI',
  'guarantee',
  'guarantees',
  'guaranteed',
  '24/7',
  '24 hour',
  '24-hour',
  'our team',
  'our engineers',
  'trusted by',
  'case study',
  'case studies',
  'testimonial',
  'testimonials',
  'Con-form',
  'Truflo',
  'WesTrac',
  'EasyIOT',
  'lorem',
  'TODO',
  'TBD',
  'placeholder',
  'example.com',
  'simon.g.tan',
];

// Literal terms: matched anywhere, case-insensitively, in the whole HTML (including JSON-LD).
const LITERAL_TERMS = ['A$', '[CONFIRM'];

// Approved exceptions (exact strings), e.g. an approved product name. Empty in v1.
const ALLOW = [];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wordRes = WORD_TERMS.map((term) => ({
  term,
  re: new RegExp(`(?<![A-Za-z0-9_])${escapeRe(term)}(?![A-Za-z0-9_])`, 'gi'),
}));

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function stripAllowed(html) {
  let out = html;
  for (const allowed of ALLOW) out = out.split(allowed).join(' ');
  return out;
}

/** Return the outer HTML of each element whose class list contains `className`. */
function elementsWithClass(html, className) {
  const results = [];
  const openRe = /<([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?\bclass\s*=\s*"([^"]*)"[^>]*>/g;
  let m;
  while ((m = openRe.exec(html))) {
    const [openTag, tag, classAttr] = m;
    if (!classAttr.split(/\s+/).includes(className)) continue;
    const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
    tagRe.lastIndex = m.index + openTag.length;
    let depth = 1;
    let end = html.length;
    let t;
    while ((t = tagRe.exec(html))) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) {
        end = t.index + t[0].length;
        break;
      }
    }
    results.push({ index: m.index, html: html.slice(m.index, end) });
  }
  return results;
}

/**
 * /contact/ must render the mailto button (with the encoded walkthrough template) and the same
 * address as visible text; /privacy/ must link the same address. Returns problem strings.
 */
async function contactChecks() {
  const problems = [];
  const read = (p) => readFile(join(DIST, p), 'utf8').catch(() => null);
  const contact = await read('contact/index.html');
  if (contact === null) return ['contact/index.html: page not found in dist/'];

  const mailto = contact.match(
    /href="mailto:([^"?\s]+@[^"?\s]+)\?subject=Walkthrough%20request&(?:amp;|#38;)?body=Business%20name[^"]*"/,
  );
  if (!mailto) {
    problems.push(
      'contact/index.html: no mailto link with the walkthrough template. Set site.contactEmail in src/config/site.ts.',
    );
    return problems;
  }
  const address = mailto[1];
  if (!new RegExp(`<strong\\b[^>]*>${escapeRe(address)}</strong>`).test(contact)) {
    problems.push(`contact/index.html: the address ${address} is not shown as visible text`);
  }
  const privacy = await read('privacy/index.html');
  if (privacy !== null && !privacy.includes(`href="mailto:${address}"`)) {
    problems.push(`privacy/index.html: the access-and-correction line does not link ${address}`);
  }
  return problems;
}

async function main() {
  try {
    await stat(DIST);
  } catch {
    console.error('check:content: dist/ not found. Run `npm run build` first.');
    process.exit(1);
  }

  const files = await walk(DIST);
  const failures = [];

  // Internal files must never be published.
  for (const file of files) {
    const rel = relative(DIST, file).split(sep).join('/');
    if (/(^|\/)(_source|docs)(\/|$)/i.test(rel) || /\.(md|zip|pdf|docx)$/i.test(rel)) {
      failures.push(`${rel}: internal file must not be in dist/`);
    }
  }

  const htmlFiles = files.filter((f) => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const rel = relative(DIST, file).split(sep).join('/');
    const raw = await readFile(file, 'utf8');
    const html = stripAllowed(raw);

    for (const { term, re } of wordRes) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(html))) {
        failures.push(`${rel}:${lineOf(html, m.index)}: forbidden term "${term}" ("${m[0]}")`);
      }
    }

    const lower = html.toLowerCase();
    for (const term of LITERAL_TERMS) {
      let from = 0;
      let idx;
      while ((idx = lower.indexOf(term.toLowerCase(), from)) !== -1) {
        failures.push(`${rel}:${lineOf(html, idx)}: forbidden term "${term}"`);
        from = idx + term.length;
      }
    }

    // "$" only in visible markup (scripts and styles removed).
    const visible = html
      .replace(/<script\b[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[\s\S]*?<\/style>/gi, '');
    if (visible.includes('$')) {
      failures.push(`${rel}: forbidden character "$" in visible content`);
    }

    // Every illustrative example must be labelled.
    for (const el of elementsWithClass(html, 'example')) {
      if (!el.html.includes('Illustrative example')) {
        failures.push(
          `${rel}:${lineOf(html, el.index)}: element with class "example" is missing the label "Illustrative example"`,
        );
      }
    }

    // Exactly one h1 per page.
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    if (h1Count !== 1) failures.push(`${rel}: expected exactly one <h1>, found ${h1Count}`);
  }

  // Contact route must give visitors a way to reach BEMA (every primary CTA ends on /contact/).
  // Enforced in CI (deploy); a local build with site.contactEmail still unset only warns.
  const contactProblems = await contactChecks();
  if (contactProblems.length) {
    if (process.env.CI) failures.push(...contactProblems);
    else {
      console.warn('check:content warning (enforced in CI, so deploy would fail):');
      for (const p of contactProblems) console.warn(`  - ${p}`);
    }
  }

  if (failures.length) {
    console.error(`check:content failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(`check:content passed: ${htmlFiles.length} HTML files scanned, no issues.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
