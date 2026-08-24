export type ConsentStatus = "granted" | "denied";

export interface CookieConsentChoice {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  updatedAt: string;
}

type ConsentMode = "advanced" | "basic";

type GoogleConsentState = {
  ad_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
  analytics_storage: ConsentStatus;
  functionality_storage: ConsentStatus;
  personalization_storage: ConsentStatus;
  security_storage: ConsentStatus;
  wait_for_update?: number;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_VERSION = 2;
const STORAGE_KEY = "santekhnic_cookie_consent_v2";
const defaultGoogleAnalyticsId = "G-EYHDV2HW79";
const configuredGoogleAnalyticsId = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim();
const googleAnalyticsId = configuredGoogleAnalyticsId || defaultGoogleAnalyticsId;
const configuredConsentMode = (import.meta.env.VITE_GA_CONSENT_MODE as string | undefined)?.trim().toLowerCase();
const consentMode: ConsentMode = configuredConsentMode === "basic" ? "basic" : "advanced";

let defaultConsentWasSent = false;
let googleTagWasConfigured = false;
let googleTagWasRequested = false;

export function isGoogleAnalyticsConfigured() {
  return googleAnalyticsId.length > 0;
}

export function getGoogleAnalyticsId() {
  return googleAnalyticsId;
}

export function getGoogleConsentMode() {
  return consentMode;
}

export function createCookieConsentChoice(
  preferences: Pick<CookieConsentChoice, "analytics" | "marketing" | "preferences">,
): CookieConsentChoice {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: preferences.analytics,
    marketing: preferences.marketing,
    preferences: preferences.preferences,
    updatedAt: new Date().toISOString(),
  };
}

export function getSavedCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue) as Partial<CookieConsentChoice>;
    if (
      parsed.version !== CONSENT_VERSION ||
      parsed.necessary !== true ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean" ||
      typeof parsed.preferences !== "boolean" ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }

    return parsed as CookieConsentChoice;
  } catch {
    return null;
  }
}

export function saveCookieConsent(choice: CookieConsentChoice) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // Consent still updates for the current page even if storage is blocked.
  }
}

export function clearCookieConsent() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors in private or locked-down browsing modes.
  }
}

export function initGoogleAnalytics(savedConsent: CookieConsentChoice | null) {
  if (typeof window === "undefined" || !isGoogleAnalyticsConfigured()) return;

  ensureGtag();
  sendDefaultConsent(savedConsent);

  if (consentMode === "advanced" || savedConsent?.analytics || savedConsent?.marketing) {
    loadGoogleTag();
  }
}

export function updateGoogleConsent(choice: CookieConsentChoice) {
  if (typeof window === "undefined" || !isGoogleAnalyticsConfigured()) return;

  ensureGtag();
  sendDefaultConsent(null);
  window.gtag?.("consent", "update", toGoogleConsentState(choice));

  if (consentMode === "advanced" || choice.analytics || choice.marketing) {
    loadGoogleTag();
  }
}

export function trackPageView(pagePath?: string) {
  if (typeof window === "undefined" || !isGoogleAnalyticsConfigured()) return;

  if (!googleTagWasConfigured) {
    if (consentMode !== "advanced") return;
    loadGoogleTag();
  }

  window.gtag?.("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath ?? `${window.location.pathname}${window.location.search}`,
  });
}

function ensureGtag() {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });
}

function sendDefaultConsent(savedConsent: CookieConsentChoice | null) {
  if (defaultConsentWasSent) return;

  window.gtag?.("consent", "default", toGoogleConsentState(savedConsent, savedConsent ? undefined : 800));
  window.gtag?.("set", "ads_data_redaction", true);
  window.gtag?.("set", "url_passthrough", true);
  defaultConsentWasSent = true;
}

function loadGoogleTag() {
  if (typeof document === "undefined" || !isGoogleAnalyticsConfigured()) return;

  ensureGtag();

  if (!googleTagWasRequested && !document.querySelector(`script[data-santekhnic-gtag="${googleAnalyticsId}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`;
    script.dataset.santekhnicGtag = googleAnalyticsId;
    document.head.appendChild(script);
    googleTagWasRequested = true;
  }

  if (!googleTagWasConfigured) {
    window.gtag?.("js", new Date());
    window.gtag?.("config", googleAnalyticsId, { send_page_view: false });
    googleTagWasConfigured = true;
  }
}

function toGoogleConsentState(choice: CookieConsentChoice | null, waitForUpdate?: number): GoogleConsentState {
  const analytics = choice?.analytics ? "granted" : "denied";
  const marketing = choice?.marketing ? "granted" : "denied";
  const preferences = choice?.preferences ? "granted" : "denied";

  return {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
    functionality_storage: "granted",
    personalization_storage: preferences,
    security_storage: "granted",
    ...(waitForUpdate ? { wait_for_update: waitForUpdate } : {}),
  };
}
