import { Helmet } from "react-helmet-async";

import { brandName, defaultLocale, supportedLocales } from "@/src/content/site";
import { absoluteUrl, rewriteLocaleInPath } from "@/src/lib/locale";
import type { Locale } from "@/src/types";

interface SeoProps {
  locale: Locale;
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  alternatePaths?: Partial<Record<Locale, string>>;
  structuredData?: Array<Record<string, unknown>>;
  noIndex?: boolean;
  image?: string | null;
  imageAlt?: string;
  localeAlternates?: boolean;
}

export function Seo({
  locale,
  title,
  description,
  keywords,
  path,
  alternatePaths,
  structuredData = [],
  noIndex = false,
  image,
  imageAlt,
  localeAlternates = true,
}: SeoProps) {
  const siteName = brandName.ru;
  const canonicalPath = path ? toCanonicalPath(path) : undefined;
  const canonical = canonicalPath ? absoluteUrl(canonicalPath) : undefined;
  const shareImage = image === null ? null : absoluteUrl(image ?? "/icon-512.png");
  const normalizedLocale = locale === "ru" ? "ru-AM" : "hy-AM";
  const hasLocaleAlternates = localeAlternates && supportedLocales.length > 1;
  const alternateUrls = canonicalPath && hasLocaleAlternates
    ? supportedLocales.map((item) => ({
        hrefLang: item === "ru" ? "ru-AM" : "hy-AM",
        href: absoluteUrl(toCanonicalPath(alternatePaths?.[item] ?? rewriteLocaleInPath(canonicalPath, item))),
      }))
    : [];
  const defaultAlternatePath = canonicalPath && hasLocaleAlternates
    ? canonicalPath === `/${locale}/`
      ? "/"
      : toCanonicalPath(alternatePaths?.[defaultLocale] ?? rewriteLocaleInPath(canonicalPath, defaultLocale))
    : undefined;

  return (
    <Helmet>
      <html lang={normalizedLocale} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta
        name="robots"
        content={noIndex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"}
      />
      <meta name="googlebot" content={noIndex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"} />
      <meta name="theme-color" content="#00aeef" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="geo.region" content="AM-ER" />
      <meta name="geo.placename" content={locale === "ru" ? "Ереван" : "Երևան"} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {alternateUrls.map((item) => (
        <link key={item.hrefLang} rel="alternate" hrefLang={item.hrefLang} href={item.href} />
      ))}
      {defaultAlternatePath ? <link rel="alternate" hrefLang="x-default" href={absoluteUrl(defaultAlternatePath)} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale === "ru" ? "ru_RU" : "hy_AM"} />
      {hasLocaleAlternates ? (
        locale === "ru" ? <meta property="og:locale:alternate" content="hy_AM" /> : <meta property="og:locale:alternate" content="ru_RU" />
      ) : null}
      {shareImage ? <meta property="og:image" content={shareImage} /> : null}
      {shareImage ? <meta property="og:image:secure_url" content={shareImage} /> : null}
      {shareImage ? <meta property="og:image:alt" content={imageAlt ?? title} /> : null}
      <meta name="twitter:card" content={shareImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {shareImage ? <meta name="twitter:image" content={shareImage} /> : null}
      {structuredData.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}

function toCanonicalPath(value: string) {
  const hashIndex = value.indexOf("#");
  const withoutHash = hashIndex >= 0 ? value.slice(0, hashIndex) : value;
  const hash = hashIndex >= 0 ? value.slice(hashIndex) : "";
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";

  if (path === "/" || path.endsWith("/") || /\.[a-z0-9]+$/i.test(path)) {
    return `${path}${query}${hash}`;
  }

  return `${path}/${query}${hash}`;
}
