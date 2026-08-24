import type { MouseEvent } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  brandName,
  businessPhoneDisplay,
  businessPhoneMachine,
  t,
} from "@/src/content/site";
import { rewriteLocaleInPath, saveLocalePreference } from "@/src/lib/locale";
import type { Locale } from "@/src/types";

const localeScrollStorageKey = "santekhnic_locale_switch_scroll_y";

export function SiteHeader({ locale }: { locale: Locale }) {
  const location = useLocation();
  const brandLabel = t(locale, brandName);
  const currentLocation = `${location.pathname}${location.search}${location.hash}`;
  const nextLocale: Locale = locale === "ru" ? "hy" : "ru";
  const localeSwitchTo = rewriteLocaleInPath(currentLocation, nextLocale);
  const localeSwitchLabel = locale === "ru" ? "Հայերեն" : "Русский";
  const localeSwitchAria =
    locale === "ru" ? "Переключить сайт на армянский" : "Փոխել կայքը ռուսերեն";
  const callLabel = locale === "ru" ? "Позвонить" : "Զանգահարել";

  const handleLocaleClick = (event: MouseEvent<HTMLAnchorElement>, selectedLocale: Locale) => {
    saveLocalePreference(selectedLocale);

    if (
      selectedLocale === locale ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    try {
      window.sessionStorage.setItem(
        localeScrollStorageKey,
        JSON.stringify({
          at: Date.now(),
          y: window.scrollY,
        }),
      );
    } catch {
      // Ignore storage errors in private or locked-down browsing modes.
    }
  };

  return (
    <header className="site-header">
      <div className="container header-main">
        <div className="header-bar">
          <Link to={`/${locale}/`} className="brand-mark brand-mark--image" aria-label={brandLabel}>
            <img
              className="brand-mark__logo"
              src="/images/santekhnic-logo-header.png"
              width="1450"
              height="230"
              alt={brandLabel}
              loading="eager"
              decoding="async"
            />
          </Link>

          <div className="header-actions">
            <div className="locale-switch locale-switch--header">
              <div className="locale-switch__items">
                <NavLink
                  to={localeSwitchTo}
                  onClick={(event) => handleLocaleClick(event, nextLocale)}
                  className="locale-link locale-link--single"
                  aria-label={localeSwitchAria}
                >
                  {localeSwitchLabel}
                </NavLink>
              </div>
            </div>

            <a href={`tel:${businessPhoneMachine}`} className="header-phone-link" aria-label={businessPhoneDisplay}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6.7 3.6 9 3.1c.8-.2 1.6.2 1.9 1l1 2.4c.3.7.1 1.4-.4 1.9l-1.2 1.2c.9 1.8 2.4 3.3 4.1 4.1l1.3-1.2c.5-.5 1.3-.6 1.9-.4l2.4 1c.8.3 1.2 1.1 1 1.9l-.5 2.3c-.2.8-.9 1.4-1.8 1.4C10.7 18.7 4.4 12.4 4.4 4.4c0-.8.6-1.6 1.3-1.8Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{callLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
