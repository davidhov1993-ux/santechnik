import { Link } from "react-router-dom";

import { businessEmail, hasBusinessEmail } from "@/src/content/contact";
import { brandName, t } from "@/src/content/site";
import { pagePath } from "@/src/lib/locale";
import type { Locale } from "@/src/types";

const email = businessEmail;
const showEmail = hasBusinessEmail;

export function SiteFooter({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const brandLabel = t(locale, brandName);

  const content = locale === "ru"
      ? {
          meta: `© ${year} ${brandLabel}`,
          city: "Ереван",
          privacy: "Политика конфиденциальности",
          cookies: "Настройки cookies",
        }
      : {
          meta: `© ${year} ${brandLabel}`,
          city: "Երևան",
          privacy: "Գաղտնիության քաղաքականություն",
          cookies: "Cookie-ների կարգավորումներ",
        };

  return (
    <footer className="site-footer site-footer--minimal">
      <div className="container site-footer__bar">
        <span className="site-footer__meta">{content.meta}</span>

        <div className="site-footer__contacts">
          <span className="site-footer__city">{content.city}</span>
          <Link to={pagePath(locale, "privacy")} className="site-footer__contact-link">
            {content.privacy}
          </Link>
          <button
            type="button"
            className="site-footer__contact-link site-footer__cookie-button"
            onClick={() => window.dispatchEvent(new Event("santekhnic:open-cookie-settings"))}
          >
            {content.cookies}
          </button>
          {showEmail ? (
            <a href={`mailto:${email}`} className="site-footer__contact-link">
              {email}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
