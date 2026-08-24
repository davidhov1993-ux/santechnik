import { useEffect, useLayoutEffect, useRef } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";

import { CookieConsent } from "@/src/components/CookieConsent";
import { SiteFooter } from "@/src/components/SiteFooter";
import { SiteHeader } from "@/src/components/SiteHeader";
import { detectPreferredLocale, isLocale } from "@/src/lib/locale";

const localeScrollStorageKey = "santekhnic_locale_switch_scroll_y";
const localeScrollMaxAgeMs = 15_000;

const readLocaleSwitchScrollY = (rawValue: string | null) => {
  if (!rawValue) return null;

  try {
    const value = JSON.parse(rawValue) as { at?: unknown; y?: unknown };
    if (typeof value.at !== "number" || typeof value.y !== "number") return null;
    if (!Number.isFinite(value.y) || Date.now() - value.at > localeScrollMaxAgeMs) return null;
    return value.y;
  } catch {
    return null;
  }
};

export function LocaleLayout() {
  const params = useParams();
  const location = useLocation();
  const restoredLocaleScroll = useRef(false);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    restoredLocaleScroll.current = false;

    let rawValue: string | null = null;

    try {
      rawValue = window.sessionStorage.getItem(localeScrollStorageKey);
      window.sessionStorage.removeItem(localeScrollStorageKey);
    } catch {
      return;
    }

    const scrollY = readLocaleSwitchScrollY(rawValue);

    if (scrollY === null) {
      if (location.hash) return;

      const resetScroll = () => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      };

      resetScroll();
      const animationFrame = window.requestAnimationFrame(resetScroll);
      const timeouts = [80, 240, 520, 1100].map((delay) => window.setTimeout(resetScroll, delay));

      return () => {
        window.cancelAnimationFrame(animationFrame);
        timeouts.forEach((timeout) => window.clearTimeout(timeout));
      };
    }

    restoredLocaleScroll.current = true;

    const restoreScroll = () => {
      const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({
        top: Math.min(Math.max(0, scrollY), maxScrollY),
        left: window.scrollX,
        behavior: "auto",
      });
    };

    restoreScroll();
    const timeout = window.setTimeout(restoreScroll, 80);
    return () => window.clearTimeout(timeout);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (restoredLocaleScroll.current) return;
    if (!location.hash) return;

    const id = location.hash.slice(1);
    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    scrollToTarget();
    const timeout = window.setTimeout(scrollToTarget, 80);
    return () => window.clearTimeout(timeout);
  }, [location.pathname, location.hash, location.key]);

  if (!isLocale(params.locale)) {
    const locale = detectPreferredLocale();
    const segments = location.pathname.split("/").filter(Boolean).slice(1);
    const suffix = segments.length > 0 ? `${segments.join("/")}/` : "";
    const nextPath = `/${locale}/${suffix}${location.search}${location.hash}`;

    return <Navigate to={nextPath} replace />;
  }

  const locale = params.locale;

  return (
    <div className="page-shell">
      <SiteHeader locale={locale} />
      <main className="page-main">
        <Outlet />
      </main>
      <SiteFooter locale={locale} />
      <CookieConsent locale={locale} />
    </div>
  );
}
