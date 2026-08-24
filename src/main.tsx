import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import "@/src/index.clean.css";
import { router } from "@/src/router";

const localeScrollStorageKey = "santekhnic_locale_switch_scroll_y";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const navigationEntry = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
const legacyNavigation = (window.performance as Performance & { navigation?: { type: number } }).navigation;
const isPageReload = navigationEntry?.type === "reload" || legacyNavigation?.type === 1;

const resetScrollToTop = () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
};

window.addEventListener("pagehide", resetScrollToTop);
window.addEventListener("beforeunload", resetScrollToTop);

if (isPageReload) {
  try {
    window.sessionStorage.removeItem(localeScrollStorageKey);
  } catch {
    // Ignore storage errors in private or locked-down browsing modes.
  }

  if (!window.location.hash) {
    resetScrollToTop();
    window.addEventListener("pageshow", resetScrollToTop, { once: true });
    window.addEventListener("load", resetScrollToTop, { once: true });
    [80, 240, 600, 1200, 2000].forEach((delay) => window.setTimeout(resetScrollToTop, delay));
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element '#root' was not found.");
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>,
);
