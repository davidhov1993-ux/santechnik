# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server on `0.0.0.0:4157`.
- `npm run build` — generates `public/sitemap.xml` + `public/robots.txt`, runs `tsc -b`, runs `vite build`, then writes static SEO HTML copies for public routes.
- `npm run preview` — serves the built `dist/`.
- `npm run dev:pages` — builds the site and serves `dist/` through local Cloudflare Pages dev.
- `npm run deploy:pages` — builds the site and deploys `dist/` to Cloudflare Pages.

There is no test runner, ESLint, or Prettier configured. Type errors from `tsc -b` are the only automated check.

## Environment

`VITE_SITE_URL` is read both at runtime (for canonical URLs / OG / hreflang in `src/lib/seo.ts` and `src/components/Seo.tsx`) and at build time by `scripts/generate-sitemap.mjs` / `scripts/enhance-static-seo.mjs`. Without it, the project falls back to the production domain `https://santekhnic-yerevan.am`. Keep it set to the final HTTPS domain before building for Cloudflare/custom-domain production.

`VITE_GA_MEASUREMENT_ID` enables Google Analytics 4 through the consent manager in `src/components/CookieConsent.tsx` and `src/lib/analytics.ts`. `VITE_GA_CONSENT_MODE` defaults to `advanced`, which loads gtag with Consent Mode v2 defaults set to denied; set it to `basic` if no Google request should be made before consent.

## Architecture

Single-page React 18 + TypeScript + Vite app. Two locales: `ru` (default) and `hy`. The contact forms submit to the Cloudflare Pages Function at `/api/contact`.

### Routing & locale

- Active routes are `/`, `/politika-konfidentsialnosti`, `/hy/`, and `/hy/politika-konfidentsialnosti/` (`src/router.tsx`). Russian is the default root version; `/ru` and `/ru/politika-konfidentsialnosti` redirect to their root equivalents.
- `LocaleLayout` (`src/layout/LocaleLayout.tsx`) guards locale params: default-locale prefixes are stripped, unsupported prefixes redirect to `/`, and valid non-default locale prefixes render that locale.
- The public site is intentionally one-page. Do not reintroduce top navigation pages for services/about/contacts unless the product direction changes.
- Use the helpers in `src/lib/locale.ts` (`pagePath`, `localePath`, `rewriteLocaleInPath`) rather than building locale-prefixed URLs by hand.
- `usePageLocale()` (`src/hooks/usePageLocale.ts`) is the standard way for a page component to read the current locale.

### Content model

`src/content/site.ts` contains shared localized text and the privacy page metadata. The visible one-page content currently lives in `HomePage`, `RuDesktopHome`, `RuMobileHome`, `HyDesktopHome`, and `HyMobileHome`. The `t(locale, value)` helper resolves a `LocalizedText` object to a string — prefer it over inline `value[locale]` access.

### SEO

Every page renders `<Seo>` (`src/components/Seo.tsx`) inside a `HelmetProvider` (set up in `src/main.tsx`). It emits canonical, `hreflang` for all locales + `x-default`, OpenGraph, Twitter, local geo meta, and inlines JSON-LD. Schema builders live in `src/lib/seo.ts` (`createBreadcrumbSchema`, `createOrganizationSchema`, `createWebSiteSchema`, `createLocalBusinessSchema`, `createHomePageSchema`). `scripts/generate-sitemap.mjs` writes hreflang-aware sitemap/robots, and `scripts/enhance-static-seo.mjs` creates static HTML copies under `dist/`, `dist/hy`, and privacy routes so crawlers and social previews see meaningful metadata before React hydrates.

### Path alias

`@/` maps to the repo root in both `tsconfig.json` and `vite.config.mts`. Imports therefore look like `@/src/content/site`, not `@/content/site`.

### Styling

Tailwind is configured (`tailwind.config.js`, `postcss.config.js`) but the current design system is consolidated in `src/index.clean.css`. New styles should extend that file and avoid reintroducing the deleted legacy CSS files.

### Documentation

`docs/deployment-cloudflare.md` is the current deployment note. Historical blueprint drafts were removed to keep the repository aligned with the live implementation.
