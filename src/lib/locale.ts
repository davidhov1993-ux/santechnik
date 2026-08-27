import {
  commonSlugs,
  defaultLocale,
  localeNames,
  siteUrl,
  supportedLocales,
} from "@/src/content/site";
import type { Locale } from "@/src/types";

export function isLocale(value?: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function normalizeLocale(value?: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function localePath(locale: Locale, suffix = "") {
  const cleanSuffix = suffix ? (suffix.startsWith("/") ? suffix : `/${suffix}`) : "";
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const path = `${prefix}${cleanSuffix}`;

  return path ? withTrailingSlash(path) : "/";
}

export function pagePath(locale: Locale, slug: keyof typeof commonSlugs) {
  return localePath(locale, commonSlugs[slug]);
}

export function absoluteUrl(path: string) {
  const origin =
    siteUrl ??
    (typeof window !== "undefined" ? window.location.origin.replace(/\/$/, "") : "");

  return origin ? `${origin}${path}` : path;
}

export function localeSwitchItems(currentPath: string) {
  return supportedLocales.map((locale) => ({
    locale,
    label: localeNames[locale],
    to: rewriteLocaleInPath(currentPath, locale),
  }));
}

export function rewriteLocaleInPath(pathname: string, nextLocale: Locale) {
  const hashIndex = pathname.indexOf("#");
  const hash = hashIndex >= 0 ? pathname.slice(hashIndex) : "";
  const pathWithSearch = hashIndex >= 0 ? pathname.slice(0, hashIndex) : pathname;
  const searchIndex = pathWithSearch.indexOf("?");
  const search = searchIndex >= 0 ? pathWithSearch.slice(searchIndex) : "";
  const cleanPath = searchIndex >= 0 ? pathWithSearch.slice(0, searchIndex) : pathWithSearch;
  const segments = cleanPath.split("/").filter(Boolean);
  const baseSegments = isLocale(segments[0]) ? segments.slice(1) : segments;
  const nextSegments = nextLocale === defaultLocale ? baseSegments : [nextLocale, ...baseSegments];
  const nextPath = nextSegments.length > 0 ? withTrailingSlash(`/${nextSegments.join("/")}`) : "/";

  return `${nextPath}${search}${hash}`;
}

function withTrailingSlash(path: string) {
  if (path === "/" || path.endsWith("/") || /\.[a-z0-9]+$/i.test(path)) {
    return path;
  }

  return `${path}/`;
}
