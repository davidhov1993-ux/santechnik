import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const cwd = process.cwd();
const envPaths = [".env.local", ".env"].map((file) => resolve(cwd, file));
const defaultSiteUrl = "https://santechnik-yerevan.am";
const locales = {
  ru: "ru-AM",
  hy: "hy-AM",
};
const localizedStaticPages = [
  { slug: "politika-konfidentsialnosti", changefreq: "monthly", priority: "0.4" },
];
const russianOnlyPages = [];

function readSiteUrl() {
  for (const filePath of envPaths) {
    try {
      const content = readFileSync(filePath, "utf8");
      const match = content.match(/^VITE_SITE_URL=(.+)$/m);

      if (match?.[1]) {
        return match[1].trim().replace(/^['"]|['"]$/g, "").replace(/\/$/, "");
      }
    } catch {
      continue;
    }
  }

  return process.env.VITE_SITE_URL?.trim().replace(/\/$/, "") || defaultSiteUrl;
}

const siteUrl = readSiteUrl();
const lastmod = new Date().toISOString().slice(0, 10);

function routePath(locale, slug) {
  const prefix = locale === "ru" ? "" : `/${locale}`;

  return slug ? `${prefix}/${slug}/` : `${prefix || ""}/`;
}

function routeUrl(locale, slug) {
  return `${siteUrl}${routePath(locale, slug)}`;
}

function alternateLinks(slug, localized = true) {
  if (!localized || Object.keys(locales).length <= 1) {
    return [];
  }

  const links = Object.entries(locales).map(([locale, hreflang]) => ({
    hreflang,
    href: routeUrl(locale, slug),
  }));

  links.push({
    hreflang: "x-default",
    href: routeUrl("ru", slug),
  });

  return links;
}

const urls = [
  ...Object.keys(locales).map((locale) => ({
    loc: routeUrl(locale),
    slug: "",
    changefreq: "weekly",
    priority: "1.0",
  })),
  ...Object.keys(locales).flatMap((locale) =>
    localizedStaticPages.map((page) => ({
      loc: routeUrl(locale, page.slug),
      slug: page.slug,
      localized: true,
      changefreq: page.changefreq,
      priority: page.priority,
    })),
  ),
  ...russianOnlyPages.map((slug) => ({
    loc: routeUrl("ru", slug),
    slug,
    localized: false,
    changefreq: "monthly",
    priority: "0.5",
  })),
];

const hasAlternates = Object.keys(locales).length > 1;
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${hasAlternates ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' : ""}>
${urls
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${alternateLinks(page.slug, page.localized)
  .map((item) => `    <xhtml:link rel="alternate" hreflang="${item.hreflang}" href="${item.href}" />`)
  .join("\n")}
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemapPath = resolve(cwd, "public", "sitemap.xml");
const robotsPath = resolve(cwd, "public", "robots.txt");

mkdirSync(dirname(sitemapPath), { recursive: true });
writeFileSync(sitemapPath, sitemapXml, "utf8");
writeFileSync(robotsPath, robotsTxt, "utf8");
