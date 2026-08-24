import {
  commonSlugs,
  defaultLocale,
  localeNames,
  siteUrl,
  supportedLocales,
} from "@/src/content/site";
import type { Locale } from "@/src/types";

const localePreferenceStorageKey = "santekhnic_locale_preference";
const geographicFallbackLocale: Locale = "hy";

export function isLocale(value?: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function normalizeLocale(value?: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function getStoredLocalePreference(): Locale | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(localePreferenceStorageKey);
    return value && isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveLocalePreference(locale: Locale) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(localePreferenceStorageKey, locale);
  } catch {
    // Locale detection still works from browser settings if storage is blocked.
  }
}

export function detectPreferredLocale() {
  const storedLocale = getStoredLocalePreference();
  if (storedLocale) return storedLocale;

  const systemLocale = detectSystemLocale();
  return systemLocale ?? geographicFallbackLocale;
}

export function detectSystemLocale(): Locale | null {
  if (typeof window === "undefined") return null;

  const browserNavigator = window.navigator as Navigator & {
    browserLanguage?: string;
    userLanguage?: string;
  };

  const candidates = [
    ...(browserNavigator.languages ?? []),
    browserNavigator.language,
    browserNavigator.userLanguage,
    browserNavigator.browserLanguage,
    getIntlLocale(),
    getTimeZoneLocale(),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const locale = localeFromLanguageTag(candidate);
    if (locale) return locale;
  }

  return null;
}

export function localePath(locale: Locale, suffix = "") {
  if (!suffix) return `/${locale}/`;
  return withTrailingSlash(`/${locale}${suffix}`);
}

export function pagePath(locale: Locale, slug: keyof typeof commonSlugs) {
  return `/${locale}/${commonSlugs[slug]}/`;
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

  if (segments.length === 0) {
    return `/${nextLocale}/${search}${hash}`;
  }

  if (isLocale(segments[0])) {
    segments[0] = nextLocale;
    return withTrailingSlash(`/${segments.join("/")}`) + search + hash;
  }

  return withTrailingSlash(`/${nextLocale}/${segments.join("/")}`) + search + hash;
}

function withTrailingSlash(path: string) {
  if (path === "/" || path.endsWith("/") || /\.[a-z0-9]+$/i.test(path)) {
    return path;
  }

  return `${path}/`;
}

function localeFromLanguageTag(value?: string): Locale | null {
  const normalized = value?.trim().toLowerCase().replace(/_/g, "-");
  if (!normalized) return null;

  const [language, region] = normalized.split("-");

  if (language === "ru") return "ru";
  if (language === "hy") return "hy";
  if (region === "am") return "hy";

  return null;
}

function getIntlLocale() {
  try {
    return new Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return undefined;
  }
}

function getTimeZoneLocale() {
  try {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Yerevan" ? "hy-AM" : undefined;
  } catch {
    return undefined;
  }
}
