# BEMA Labs website

Static site built with [Astro](https://astro.build) and deployed to GitHub Pages by GitHub Actions.

## Requirements

- Node 22 or later
- npm

## Commands

| Command | What it does |
|---|---|
| `npm ci` | Install dependencies from `package-lock.json` |
| `npm run dev` | Start the local dev server at `http://localhost:4321` |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run check:content` | Scan `dist/` for terms that must not be published (run after `build`) |
| `npm run check:prelaunch` | Confirm the site configuration is ready to deploy |

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

The workflow sets `SITE_URL` and `BASE_PATH` from the repository name, so the site works at either `https://<owner>.github.io/` or `https://<owner>.github.io/<repo>/`. Internal links go through `withBase()` in `src/lib/url.ts` for the same reason.

Deployment stops at `check:prelaunch` until a contact email is set in `src/config/site.ts`.
